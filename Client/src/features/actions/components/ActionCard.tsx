import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubActionAvailability } from "@/features/actions/actionTypes";
import { formatCashFull } from "@/features/clubs/utils/clubOverviewHelpers";
import {
  formatChancePercent,
  getActionIcon,
} from "@/features/actions/utils/actionsHubHelpers";
import {
  getPathAffinityBadgeClass,
  getPathAffinityIcon,
  getPathAffinityLabel,
} from "@/features/actions/utils/actionPresentationHelpers";
import { ActionMoralityDeltas } from "@/features/actions/components/ActionMoralityDeltas";
import { ActionRequirementChips } from "@/features/actions/components/ActionRequirementChips";

interface ActionCardProps {
  action: ClubActionAvailability;
  onExecute: (action: ClubActionAvailability) => void;
}

export const ActionCard = ({ action, onExecute }: ActionCardProps) => {
  const cooldownValue =
    action.cooldownDays > 0
      ? action.cooldownRemainingDays > 0
        ? `${action.cooldownRemainingDays}d left`
        : `${action.cooldownDays}d`
      : "None";

  const isLocked = !action.isAvailable;

  return (
    <div
      className={[
        "flex flex-col rounded-xl border bg-surface-container p-5",
        action.isUnlockTeaser
          ? "border-dashed border-outline-variant opacity-90"
          : "border-outline-variant",
      ].join(" ")}
    >
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low text-primary">
          <MaterialIcon name={getActionIcon(action.actionType)} className="text-2xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {action.displayName}
            </h3>
            <span
              className={[
                "inline-flex items-center gap-1 rounded border px-2 py-0.5 font-label-caps text-label-caps",
                getPathAffinityBadgeClass(action.pathAffinity),
              ].join(" ")}
            >
              <MaterialIcon name={getPathAffinityIcon(action.pathAffinity)} className="text-xs" />
              {getPathAffinityLabel(action.pathAffinity)}
            </span>
            {action.isShady ? (
              <span className="rounded border border-secondary/30 bg-secondary/10 px-2 py-0.5 font-label-caps text-label-caps text-secondary">
                Gray Area
              </span>
            ) : null}
            {action.isHonorablePower ? (
              <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-label-caps text-label-caps text-primary">
                Honorable Power
              </span>
            ) : null}
            {action.requiresShadyTierII ? (
              <span className="rounded border border-error/30 bg-error/10 px-2 py-0.5 font-label-caps text-label-caps text-error">
                Tier II
              </span>
            ) : null}
          </div>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {action.description}
          </p>
        </div>
      </div>

      <div className="mb-3 space-y-3">
        <ActionRequirementChips requirements={action.requirements ?? []} />
        <ActionMoralityDeltas
          legitimacyDeltaOnSuccess={action.legitimacyDeltaOnSuccess}
          infamyDeltaOnSuccess={action.infamyDeltaOnSuccess}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat
          label="Cost"
          value={action.cost > 0 ? formatCashFull(action.cost) : "Free"}
        />
        <Stat label="Success" value={formatChancePercent(action.successChance)} />
        <Stat
          label="Heat"
          value={action.heatGenerated > 0 ? `+${action.heatGenerated}` : "None"}
        />
        <Stat label="Cooldown" value={cooldownValue} />
        <Stat
          label="Detection"
          value={
            action.isShady ? formatChancePercent(action.detectionChance) : "—"
          }
        />
      </div>

      {isLocked ? (
        <div className="mt-auto space-y-2">
          {action.isUnlockTeaser && action.unlockHint ? (
            <div className="rounded border border-primary/30 bg-primary/5 px-3 py-2 font-body-sm text-body-sm text-on-surface">
              <div className="mb-1 flex items-center gap-2 font-label-caps text-label-caps text-primary">
                <MaterialIcon name="auto_awesome" className="text-sm" />
                Unlock path
              </div>
              {action.unlockHint}
            </div>
          ) : null}
          <div className="flex items-center gap-2 rounded border border-outline-variant bg-surface-variant px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
            <MaterialIcon name="lock" className="text-sm" />
            {action.unavailableReason ?? "Unavailable"}
          </div>
        </div>
      ) : (
        <div className="mt-auto flex justify-end">
          <button
            type="button"
            onClick={() => {
              onExecute(action);
            }}
            className="flex items-center gap-2 rounded bg-primary px-5 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            <MaterialIcon name="bolt" className="text-sm" />
            Execute
          </button>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => {
  return (
    <div>
      <div className="mb-0.5 font-label-caps text-label-caps text-on-surface-variant">
        {label}
      </div>
      <div className="font-data-mono text-data-mono text-on-surface">{value}</div>
    </div>
  );
};
