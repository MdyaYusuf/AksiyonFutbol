import { ActionExecuteButton } from "@/features/actions/components/ActionExecuteButton";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { BriberyContext } from "@/features/bribery/briberyTypes";
import { BribeAttemptOutcome } from "@/features/bribery/briberyTypes";
import { ActionCardStatsPanel } from "@/features/actions/components/ActionCardStatsPanel";
import { formatChancePercent } from "@/features/actions/utils/actionsHubHelpers";
import { getActionLockedPresentation } from "@/features/actions/utils/actionPresentationHelpers";
import { getPreviewStakeOption } from "@/features/bribery/utils/matchInfluenceHelpers";

interface BribeRefereeActionCardProps {
  briberyContext?: BriberyContext;
  isLoading: boolean;
}

export const BribeRefereeActionCard = ({
  briberyContext,
  isLoading,
}: BribeRefereeActionCardProps) => {
  const alreadyAttempted = briberyContext?.alreadyAttempted ?? false;
  const canAttempt = briberyContext?.canAttempt ?? false;
  const canOpen = canAttempt && !alreadyAttempted;
  const previewStake = briberyContext ? getPreviewStakeOption(briberyContext) : null;

  const outcomeLabel =
    briberyContext?.existingOutcome === BribeAttemptOutcome.Succeeded
      ? "Succeeded"
      : briberyContext?.existingOutcome === BribeAttemptOutcome.Failed
        ? "Failed"
        : null;

  const successValue =
    canAttempt && previewStake
      ? formatChancePercent(previewStake.successChance)
      : canAttempt && briberyContext
        ? formatChancePercent(briberyContext.estimatedSuccessChance)
        : "—";

  const stats = [
    {
      label: "Success",
      value: isLoading ? "…" : successValue,
      valueClassName: "text-secondary",
    },
    {
      label: "Heat",
      value:
        previewStake && previewStake.heatGenerated > 0
          ? `+${previewStake.heatGenerated}`
          : "—",
      valueClassName: "text-error",
    },
    {
      label: "Detect",
      value: previewStake ? formatChancePercent(previewStake.detectionChance) : "—",
    },
    {
      label: "Stake",
      value: isLoading ? "…" : "Variable",
    },
  ];

  const lockedReason =
    briberyContext?.unavailableReason ??
    "No upcoming fixture with a referee assigned.";
  const lockedPresentation = getActionLockedPresentation(lockedReason);
  const usedPresentation = getActionLockedPresentation("Already used for this fixture.");

  return (
    <div className="group flex flex-col rounded border border-[#334155] bg-surface-container-high p-4 transition-colors hover:bg-[#334155]">
      <div className="mb-3">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h4 className="font-headline-sm text-headline-sm text-on-surface">
            Approach Referee
          </h4>
          <span className="rounded border border-secondary/30 bg-secondary/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary">
            Gray Area
          </span>
        </div>
        <p className="mt-2 font-body-sm text-body-sm leading-snug text-on-surface-variant">
          Quietly sound out the match official for friendlier decisions. Success tilts
          scoring odds your way — but scrutiny rises with every push.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-variant px-2 py-1 font-data-mono text-xs text-on-surface-variant">
            <MaterialIcon name="payments" className="text-[14px]" />
            Variable stake
          </span>
        </div>
      </div>

      <ActionCardStatsPanel stats={stats} columns={4} />

      {alreadyAttempted ? (
        <div
          className={[
            "mt-auto flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 font-body-sm text-body-sm font-semibold normal-case",
            usedPresentation.buttonClassName,
          ].join(" ")}
        >
          <MaterialIcon name="info" className={["text-sm", usedPresentation.iconClassName].join(" ")} />
          Already used for this fixture
          {outcomeLabel ? ` (${outcomeLabel})` : ""}
        </div>
      ) : !canAttempt && !isLoading ? (
        <button
          type="button"
          disabled
          className={[
            "mt-auto flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 font-body-sm text-body-sm font-semibold normal-case",
            lockedPresentation.buttonClassName,
          ].join(" ")}
        >
          <MaterialIcon
            name="lock"
            className={["text-[18px]", lockedPresentation.iconClassName].join(" ")}
          />
          {lockedReason}
        </button>
      ) : (
        <div className="mt-auto flex justify-end">
          <ActionExecuteButton to="/app/actions/bribe" unavailable={!canOpen}>
            Open Flow
          </ActionExecuteButton>
        </div>
      )}
    </div>
  );
};
