import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { OnboardingSteps } from "../../../core/components/onboarding/OnboardingSteps";
import {
  APP_DASHBOARD_PATH,
  ONBOARDING_CLUB_PATH,
  ONBOARDING_PRESIDENT_PATH,
} from "../../../core/routes/onboardingPaths";
import { useCheckCurrentUserHasPresidentQuery } from "../../clubPresidents/clubPresidentsApiSlice";
import { useGetCurrentUserClubQuery } from "../../clubs/clubsApiSlice";
import { isDraftingClub } from "../../clubs/utils/clubLifecycleHelpers";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import {
  useAddClubDraftPickMutation,
  useFinalizeClubDraftMutation,
  useGetClubDraftCatalogQuery,
  useGetClubDraftStateQuery,
  useRemoveClubDraftPickMutation,
} from "../clubDraftsApiSlice";
import { DraftBudgetMeters } from "../components/DraftBudgetMeters";
import { DraftCatalogTable } from "../components/DraftCatalogTable";
import { DraftCatalogToolbar } from "../components/DraftCatalogToolbar";
import { DraftPicksPanel } from "../components/DraftPicksPanel";
import { DraftQuotaBar } from "../components/DraftQuotaBar";
import {
  DEFAULT_DRAFT_CATALOG_SORT,
  filterDraftCatalog,
  sortDraftCatalog,
  toggleDraftCatalogSort,
  type DraftCatalogSortColumn,
  type DraftTierFilter,
} from "../utils/draftBoardHelpers";

export const DraftBoardPage = () => {
  const navigate = useNavigate();
  const { data: hasPresident, isLoading: isPresidentLoading } =
    useCheckCurrentUserHasPresidentQuery();
  const {
    data: club,
    isLoading: isClubDetailLoading,
    isError: isClubError,
  } = useGetCurrentUserClubQuery(undefined, {
    skip: hasPresident !== true,
  });

  const skipDraftQueries = !isDraftingClub(club?.lifecycleStatus);
  const { data: catalog = [], isLoading: isCatalogLoading } =
    useGetClubDraftCatalogQuery(undefined, { skip: skipDraftQueries });
  const { data: draft, isLoading: isDraftLoading } = useGetClubDraftStateQuery(
    undefined,
    { skip: skipDraftQueries },
  );

  const [addPick] = useAddClubDraftPickMutation();
  const [removePick] = useRemoveClubDraftPickMutation();
  const [finalizeDraft, { isLoading: isFinalizing }] = useFinalizeClubDraftMutation();

  const [positionFilter, setPositionFilter] = useState<SquadPositionFilter>("ALL");
  const [tierFilter, setTierFilter] = useState<DraftTierFilter>("ALL");
  const [catalogSort, setCatalogSort] = useState(DEFAULT_DRAFT_CATALOG_SORT);
  const [busyPlayerId, setBusyPlayerId] = useState<string | null>(null);

  const filteredCatalog = useMemo(
    () =>
      sortDraftCatalog(
        filterDraftCatalog(catalog, positionFilter, tierFilter),
        catalogSort,
      ),
    [catalog, catalogSort, positionFilter, tierFilter],
  );

  const handleCatalogSortChange = (column: DraftCatalogSortColumn) => {
    setCatalogSort((current) => toggleDraftCatalogSort(current, column));
  };

  const isLoading =
    isPresidentLoading
    || isClubDetailLoading
    || isCatalogLoading
    || isDraftLoading;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-on-surface-variant">
        Draft tahtası hazırlanıyor...
      </div>
    );
  }

  if (!hasPresident) {
    return <Navigate to={ONBOARDING_PRESIDENT_PATH} replace />;
  }

  if (isClubError || !club) {
    return <Navigate to={ONBOARDING_CLUB_PATH} replace />;
  }

  if (!isDraftingClub(club.lifecycleStatus) || !draft) {
    return <Navigate to={APP_DASHBOARD_PATH} replace />;
  }

  const handlePick = async (basePlayerId: string) => {
    setBusyPlayerId(basePlayerId);

    try {
      await addPick({ basePlayerId }).unwrap();
    } catch {
      /* Toasts via apiClient */
    } finally {
      setBusyPlayerId(null);
    }
  };

  const handleRemove = async (basePlayerId: string) => {
    setBusyPlayerId(basePlayerId);

    try {
      await removePick(basePlayerId).unwrap();
    } catch {
      /* Toasts via apiClient */
    } finally {
      setBusyPlayerId(null);
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeDraft().unwrap();
      navigate(APP_DASHBOARD_PATH, { replace: true });
    } catch {
      /* Toasts via apiClient */
    }
  };

  return (
    <div className="flex h-[calc(100vh-5.5rem)] flex-col overflow-hidden p-4 md:p-6">
      <div className="mx-auto flex h-full w-full max-w-[1400px] min-h-0 flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1 text-label-caps text-on-surface-variant">
            <MaterialIcon name="groups" className="text-sm text-primary" filled />
            Open-pool draft
          </div>
          <h1 className="text-[28px] leading-9 font-extrabold tracking-tight text-primary lg:text-[34px] lg:leading-10">
            Draft your squad
          </h1>
          <p className="max-w-3xl text-body-sm text-on-surface-variant">
            Fill {draft.clubName}&apos;s quotas under the fee and wage caps. Bots
            draft the leftovers after you finalize, then your private placement league starts.
          </p>
          <OnboardingSteps currentStep="draft" className="mt-2 max-w-3xl" />
        </div>

        <div className="grid h-full min-h-0 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex min-h-0 flex-col gap-3">
            <DraftCatalogToolbar
              positionFilter={positionFilter}
              onPositionFilterChange={setPositionFilter}
              tierFilter={tierFilter}
              onTierFilterChange={setTierFilter}
            />
            <DraftCatalogTable
              players={filteredCatalog}
              draft={draft}
              sort={catalogSort}
              busyPlayerId={busyPlayerId}
              onSortChange={handleCatalogSortChange}
              onPick={handlePick}
              onRemove={handleRemove}
            />
          </div>

          <div className="flex min-h-0 flex-col gap-3">
            <DraftBudgetMeters draft={draft} />
            <DraftQuotaBar quotas={draft.quotas} />
            <DraftPicksPanel
              draft={draft}
              isFinalizing={isFinalizing}
              onRemove={handleRemove}
              onFinalize={handleFinalize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
