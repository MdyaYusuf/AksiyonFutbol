import { useMemo, useState } from "react";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import { useGetBriberyContextQuery } from "../../bribery/briberyApiSlice";
import { CashSpendLockBanner } from "../../matches/components/CashSpendLockBanner";
import {
  useExecuteClubActionMutation,
  useGetActionsContextQuery,
  useGetMyActionHistoryQuery,
} from "../actionsApiSlice";
import type {
  ClubActionAvailability,
  ClubActionResult,
  MediaSpinMode,
} from "../actionTypes";
import { ClubActionOutcome } from "../actionTypes";
import { ActionCategorySection } from "../components/ActionCategorySection";
import { ActionResultBanner } from "../components/ActionResultBanner";
import { ActionsHubHeader } from "../components/ActionsHubHeader";
import { ExecuteActionModal } from "../components/ExecuteActionModal";
import { groupActionsByCategory } from "../utils/actionsHubHelpers";

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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <ActionsHubHeader
        clubCash={context.clubCash}
        suspicion={context.suspicion}
        maxSuspicion={context.maxSuspicion}
        president={context.president}
      />

      {context.cashSpendLocked ? <CashSpendLockBanner /> : null}

      {lastResult ? (
        <ActionResultBanner
          result={lastResult}
          onDismiss={() => {
            setLastResult(null);
          }}
        />
      ) : null}

      {context.upcomingMatch ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Next fixture: Week {context.upcomingMatch.matchWeek} ·{" "}
          {context.upcomingMatch.homeClubName} vs {context.upcomingMatch.awayClubName}
          {context.upcomingMatch.isHome ? " (Home)" : " (Away)"}
        </p>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          No upcoming fixture. Match-scoped actions are unavailable until the next match
          is scheduled.
        </p>
      )}

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

      {recentHistory.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
            <MaterialIcon name="history" className="text-primary" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              Recent History
            </h2>
          </div>
          <ul className="divide-y divide-outline-variant rounded-xl border border-outline-variant bg-surface-container">
            {recentHistory.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
              >
                <div>
                  <div className="font-body-sm text-body-sm font-semibold text-on-surface">
                    {item.displayName}
                  </div>
                  <div
                    className={[
                      "font-body-sm text-body-sm",
                      item.wasDetected ? "text-error" : "text-on-surface-variant",
                    ].join(" ")}
                  >
                    {item.outcome === ClubActionOutcome.Succeeded ? "Succeeded" : "Failed"}
                    {item.wasDetected ? " · Detected" : ""}
                    {item.fineAmount > 0
                      ? ` · Fine ${formatCashFull(item.fineAmount)}`
                      : ""}
                    {item.matchPenaltyApplied ? " · Match penalty" : ""}
                    {item.matchWeek != null ? ` · Week ${item.matchWeek}` : ""}
                  </div>
                </div>
                <div className="font-label-caps text-label-caps text-on-surface-variant">
                  {item.heatGenerated > 0 ? `+${item.heatGenerated} heat` : "No heat"}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {selectedAction ? (
        <ExecuteActionModal
          action={selectedAction}
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
