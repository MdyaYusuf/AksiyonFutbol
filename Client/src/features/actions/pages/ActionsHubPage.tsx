import { useMemo, useState } from "react";
import { useGetBriberyContextQuery } from "@/features/bribery/briberyApiSlice";
import { CashSpendLockBanner } from "@/features/matches/components/CashSpendLockBanner";
import {
  useExecuteClubActionMutation,
  useGetActionsContextQuery,
  useGetMyActionHistoryQuery,
} from "@/features/actions/actionsApiSlice";
import type {
  ClubActionAvailability,
  ClubActionResult,
  MediaSpinMode,
} from "@/features/actions/actionTypes";
import { ActionCategorySection } from "@/features/actions/components/ActionCategorySection";
import { ActionResultBanner } from "@/features/actions/components/ActionResultBanner";
import { ActionsFixtureBanner } from "@/features/actions/components/ActionsFixtureBanner";
import { ActionsPageIntro } from "@/features/actions/components/ActionsPageIntro";
import { ActionsRecentHistoryTable } from "@/features/actions/components/ActionsRecentHistoryTable";
import { ActionsSummaryGrid } from "@/features/actions/components/ActionsSummaryGrid";
import { ExecuteActionModal } from "@/features/actions/components/ExecuteActionModal";
import { groupActionsByCategory } from "@/features/actions/utils/actionsHubHelpers";

export const ActionsHubPage = () => {
  const {
    data: context,
    isLoading,
    isError,
  } = useGetActionsContextQuery();
  const { data: briberyContext, isLoading: briberyLoading } =
    useGetBriberyContextQuery();
  const { data: history = [] } = useGetMyActionHistoryQuery();
  const [executeAction, { isLoading: isExecuting }] = useExecuteClubActionMutation();
  const [selectedAction, setSelectedAction] = useState<ClubActionAvailability | null>(
    null,
  );
  const [lastResult, setLastResult] = useState<ClubActionResult | null>(null);

  const grouped = useMemo(
    () => (context ? groupActionsByCategory(context.actions) : []),
    [context],
  );

  const recentHistory = history.slice(0, 8);

  const handleConfirm = async (options: {
    mediaSpinMode?: MediaSpinMode;
    targetPlayerInstanceId?: string;
  }) => {
    if (!selectedAction) {
      return;
    }

    try {
      const result = await executeAction({
        actionType: selectedAction.actionType,
        matchId: context?.upcomingMatch?.matchId ?? null,
        mediaSpinMode: options.mediaSpinMode ?? null,
        targetPlayerInstanceId: options.targetPlayerInstanceId ?? null,
      }).unwrap();
      setSelectedAction(null);
      setLastResult(result);
    } catch {
      /* Toasts via apiClient */
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading actions...
      </div>
    );
  }

  if (isError || !context) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Actions could not be loaded.
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <ActionsPageIntro />

      {context.cashSpendLocked ? (
        <div className="mb-8">
          <CashSpendLockBanner />
        </div>
      ) : null}

      {lastResult ? (
        <div className="mb-8">
          <ActionResultBanner
            result={lastResult}
            onDismiss={() => {
              setLastResult(null);
            }}
          />
        </div>
      ) : null}

      <ActionsSummaryGrid
        clubCash={context.clubCash}
        suspicion={context.suspicion}
        maxSuspicion={context.maxSuspicion}
        president={context.president}
      />

      <ActionsFixtureBanner upcomingMatch={context.upcomingMatch} />

      <div className="space-y-12">
        {grouped.map(({ category, actions }) => (
          <ActionCategorySection
            key={category}
            category={category}
            actions={actions}
            briberyContext={briberyContext}
            briberyLoading={briberyLoading}
            onExecute={setSelectedAction}
          />
        ))}
      </div>

      <ActionsRecentHistoryTable items={recentHistory} />

      {selectedAction ? (
        <ExecuteActionModal
          action={selectedAction}
          clubId={context.clubId}
          matchId={context.upcomingMatch?.matchId}
          isSubmitting={isExecuting}
          onClose={() => {
            setSelectedAction(null);
          }}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  );
};
