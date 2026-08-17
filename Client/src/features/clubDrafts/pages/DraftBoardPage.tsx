import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
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
  filterDraftCatalog,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [busyPlayerId, setBusyPlayerId] = useState<string | null>(null);

  const filteredCatalog = useMemo(
    () => filterDraftCatalog(catalog, positionFilter, tierFilter, searchQuery),
    [catalog, positionFilter, searchQuery, tierFilter],
  );

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
    <div className="flex flex-1 flex-col overflow-y-auto p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-outline-variant/50 bg-surface-container px-3 py-1 text-label-caps text-on-surface-variant">
            <MaterialIcon name="groups" className="text-sm text-primary" filled />
            Open-pool draft
          </div>
          <h1 className="text-[32px] leading-10 font-extrabold tracking-tight text-primary lg:text-display-lg lg:leading-[56px]">
            Draft your squad
          </h1>
          <p className="max-w-2xl text-body-lg text-on-surface-variant">
            Fill {draft.clubName}&apos;s quotas under the fee and wage caps. Bots
            draft the leftovers after you finalize, then your private tutorial starts.
          </p>
        </div>

        <DraftBudgetMeters draft={draft} />
        <DraftQuotaBar quotas={draft.quotas} />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-8">
            <DraftCatalogToolbar
              positionFilter={positionFilter}
              onPositionFilterChange={setPositionFilter}
              tierFilter={tierFilter}
              onTierFilterChange={setTierFilter}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
            />
            <DraftCatalogTable
              players={filteredCatalog}
              draft={draft}
              busyPlayerId={busyPlayerId}
              onPick={handlePick}
              onRemove={handleRemove}
            />
          </div>

          <div className="lg:col-span-4">
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
