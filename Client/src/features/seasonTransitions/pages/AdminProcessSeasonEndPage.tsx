import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useState } from "react";
import { useGetLeagueDivisionsQuery } from "../../leagueDivisions/leagueDivisionsApiSlice";
import {
  AdminSeasonEndExecute,
  AdminSeasonEndWarning,
} from "../components/AdminSeasonEndExecutePanel";
import { AdminSeasonEndMoversTable } from "../components/AdminSeasonEndMoversTable";
import { AdminSeasonEndPreflight } from "../components/AdminSeasonEndPreflight";
import {
  useGetSeasonEndPreviewQuery,
  useProcessSeasonEndMutation,
} from "../seasonTransitionsApiSlice";
import {
  buildAdminProjectedRows,
  getPreflightChecks,
  getSelectedDivisionPreview,
} from "../utils/adminProcessSeasonEndHelpers";

export const AdminProcessSeasonEndPage = () => {
  const [selectedDivisionId, setSelectedDivisionId] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showAllClubs, setShowAllClubs] = useState(false);

  const { data: divisionsData, isLoading: isDivisionsLoading } = useGetLeagueDivisionsQuery({
    currentPage: 1,
    pageSize: 100,
  });

  const divisions = useMemo(() => {
    const items = divisionsData?.items ?? [];
    return [...items].sort((left, right) => {
      if (left.tier !== right.tier) {
        return left.tier - right.tier;
      }

      return left.groupNumber - right.groupNumber;
    });
  }, [divisionsData?.items]);

  useEffect(() => {
    if (selectedDivisionId !== null || divisions.length === 0) {
      return;
    }

    setSelectedDivisionId(divisions[0]!.id);
  }, [divisions, selectedDivisionId]);

  useEffect(() => {
    setConfirmed(false);
    setShowAllClubs(false);
  }, [selectedDivisionId]);

  const {
    data: preview,
    isLoading: isPreviewLoading,
    isFetching: isPreviewFetching,
    isError: isPreviewError,
  } = useGetSeasonEndPreviewQuery(selectedDivisionId ?? skipToken);

  const [processSeasonEnd, { isLoading: isSubmitting }] = useProcessSeasonEndMutation();

  const selectedDivision = useMemo(() => {
    if (!preview || selectedDivisionId === null) {
      return undefined;
    }

    return getSelectedDivisionPreview(preview, selectedDivisionId);
  }, [preview, selectedDivisionId]);

  const projectedRows = useMemo(() => {
    if (!preview || selectedDivisionId === null) {
      return [];
    }

    return buildAdminProjectedRows(preview, selectedDivisionId, showAllClubs);
  }, [preview, selectedDivisionId, showAllClubs]);

  const preflight = getPreflightChecks(preview, selectedDivision);
  const selectedMeta = divisions.find((division) => division.id === selectedDivisionId);

  const handleProcess = async () => {
    if (selectedDivisionId === null || !preview?.canProcess || !confirmed) {
      return;
    }

    try {
      await processSeasonEnd(selectedDivisionId).unwrap();
      setConfirmed(false);
      setShowAllClubs(false);
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isDivisionsLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading divisions...
      </div>
    );
  }

  if (divisions.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        No league divisions found.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Process Season End
          </h1>
          <p className="mt-1 text-on-surface-variant">
            Finalize standings, execute promotions, relegations, and reset league data.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded border border-outline-variant bg-surface-container px-4 py-2">
          <label
            htmlFor="admin-season-end-division"
            className="font-label-caps text-label-caps uppercase text-on-surface-variant"
          >
            Target Division
          </label>
          <select
            id="admin-season-end-division"
            value={selectedDivisionId ?? ""}
            onChange={(event) => setSelectedDivisionId(Number(event.target.value))}
            className="cursor-pointer border-none bg-transparent font-body-sm text-body-sm text-on-surface focus:ring-0"
          >
            {divisions.map((division) => (
              <option key={division.id} value={division.id} className="bg-surface-container">
                {division.name} (Tier {division.tier}, Group {division.groupNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPreviewLoading || isPreviewFetching ? (
        <div className="flex min-h-[30vh] items-center justify-center text-on-surface-variant">
          Loading season-end preview...
        </div>
      ) : isPreviewError || !preview ? (
        <div className="rounded-lg border border-error/30 bg-error-container/20 p-6 text-body-sm text-error">
          Season-end preview could not be loaded for this division.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-gutter lg:col-span-8">
            <AdminSeasonEndPreflight
              fixtures={preflight.fixtures}
              dataSync={preflight.dataSync}
              backup={preflight.backup}
            />
            <AdminSeasonEndMoversTable
              divisionName={selectedDivision?.divisionName ?? selectedMeta?.name ?? "Division"}
              rows={projectedRows}
              totalClubCount={selectedDivision?.standings.length ?? 0}
              showAll={showAllClubs}
              onToggleShowAll={() => setShowAllClubs((value) => !value)}
            />
          </div>

          <div className="flex flex-col gap-gutter lg:col-span-4">
            <AdminSeasonEndWarning blockReason={preview.blockReason} />
            <AdminSeasonEndExecute
              confirmed={confirmed}
              canProcess={preview.canProcess}
              isSubmitting={isSubmitting}
              onConfirmedChange={setConfirmed}
              onProcess={handleProcess}
            />
          </div>
        </div>
      )}
    </div>
  );
};
