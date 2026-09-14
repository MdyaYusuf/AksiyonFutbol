import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { ClubActionAvailability } from "@/features/actions/actionTypes";
import { ClubActionCategory } from "@/features/actions/actionTypes";
import { ActionExecuteButton } from "@/features/actions/components/ActionExecuteButton";
import { ActionsCashAmount } from "@/features/actions/components/ActionsCashAmount";
import { ActionMoralityDeltas } from "@/features/actions/components/ActionMoralityDeltas";
import { ActionCardStatsPanel } from "@/features/actions/components/ActionCardStatsPanel";
import {
  formatChancePercent,
  formatCooldownDisplay,
} from "@/features/actions/utils/actionsHubHelpers";
import {
  getPathAffinityShortBadgeClass,
  getPathAffinityShortLabel,
  getRequirementChipClass,
  getRequirementIcon,
  getActionLockedPresentation,
  cashAccent,
  honorablePowerAccent,
} from "@/features/actions/utils/actionPresentationHelpers";

interface ActionCardProps {
  action: ClubActionAvailability;
  onExecute: (action: ClubActionAvailability) => void;
}

const ACTION_CARD_SHELL =
  "group flex flex-col rounded border border-[#334155] bg-surface-container-high p-4 transition-colors hover:bg-[#334155]";

export const ActionCard = ({ action, onExecute }: ActionCardProps) => {
  const isLocked = !action.isAvailable;
  const isSquad = action.category === ClubActionCategory.Squad;
  const cooldownValue = formatCooldownDisplay(
    action.cooldownDays,
    action.cooldownRemainingDays,
  );
  const successValue = formatChancePercent(action.successChance);
  const cooldownClassName =
    cooldownValue !== "None" ? "text-error" : "text-on-surface";
  const lockedReason = action.unavailableReason ?? "Unavailable";
  const lockedPresentation = getActionLockedPresentation(lockedReason);

  const stats = isSquad
    ? [
        {
          label: "Cost",
          value: <ActionsCashAmount amount={action.cost} />,
          valueClassName: cashAccent.text,
        },
        {
          label: "Success",
          value: successValue,
          valueClassName: "text-primary",
        },
      ]
    : [
        {
          label: "Success",
          value: successValue,
          valueClassName: action.isShady ? "text-secondary" : "text-primary",
        },
        {
          label: "Heat",
          value: action.heatGenerated > 0 ? `+${action.heatGenerated}` : "0",
          valueClassName:
            action.heatGenerated > 0 ? "text-error" : "text-on-surface",
        },
        {
          label: "Detect",
          value: action.isShady
            ? formatChancePercent(action.detectionChance)
            : "0%",
        },
        {
          label: "Cooldown",
          value: cooldownValue,
          valueClassName: cooldownClassName,
        },
      ];

  return (
    <div
      className={[
        ACTION_CARD_SHELL,
        action.isUnlockTeaser ? "border-dashed opacity-90" : "",
      ].join(" ")}
    >
      <div className="mb-3">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h4 className="font-headline-sm text-headline-sm text-on-surface">
            {action.displayName}
          </h4>
          {action.isShady ? (
            <span className="rounded border border-secondary/30 bg-secondary/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-secondary">
              Gray Area
            </span>
          ) : (
            <span
              className={[
                "rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
                getPathAffinityShortBadgeClass(action.pathAffinity),
              ].join(" ")}
            >
              {getPathAffinityShortLabel(action.pathAffinity)}
            </span>
          )}
          {action.isHonorablePower ? (
            <span
              className={[
                "rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-wider",
                honorablePowerAccent.badge,
              ].join(" ")}
            >
              Honorable Power
            </span>
          ) : null}
          {action.requiresShadyTierII ? (
            <span className="rounded border border-error/30 bg-error/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-error">
              Tier II
            </span>
          ) : null}
        </div>

        <p className="mt-2 font-body-sm text-body-sm leading-snug text-on-surface-variant">
          {action.description}
        </p>

        {(action.requirements?.length ?? 0) > 0 || action.cost > 0 ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {action.requirements?.map((requirement) => (
              <span
                key={requirement.key}
                className={[
                  "inline-flex items-center gap-1 rounded border px-2 py-1 font-data-mono text-xs",
                  getRequirementChipClass(requirement),
                ].join(" ")}
              >
                <MaterialIcon
                  name={getRequirementIcon(requirement.key)}
                  className="text-[14px]"
                />
                {requirement.label} {requirement.currentValue}/{requirement.requiredValue}
              </span>
            ))}
            {!isSquad && action.cost > 0 ? (
              <span
                className={[
                  "inline-flex items-center rounded border px-2 py-1 font-data-mono text-xs",
                  cashAccent.chip,
                ].join(" ")}
              >
                <ActionsCashAmount amount={action.cost} />
              </span>
            ) : null}
          </div>
        ) : null}

        <ActionMoralityDeltas
          legitimacyDeltaOnSuccess={action.legitimacyDeltaOnSuccess}
          infamyDeltaOnSuccess={action.infamyDeltaOnSuccess}
        />
      </div>

      <ActionCardStatsPanel stats={stats} columns={isSquad ? 2 : 4} />

      {isLocked ? (
        <div className="mt-auto space-y-2">
          {action.isUnlockTeaser && action.unlockHint ? (
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {action.unlockHint}
            </p>
          ) : null}
          <button
            type="button"
            disabled
            className={[
              "flex w-full items-center justify-center gap-2 rounded border px-3 py-2.5 font-body-sm text-body-sm font-semibold normal-case",
              lockedPresentation.buttonClassName,
            ].join(" ")}
          >
            <MaterialIcon
              name="lock"
              className={["text-[18px]", lockedPresentation.iconClassName].join(" ")}
            />
            {lockedReason}
          </button>
        </div>
      ) : (
        <div className="mt-auto flex justify-end">
          <ActionExecuteButton
            onClick={() => {
              onExecute(action);
            }}
          >
            Execute Action
          </ActionExecuteButton>
        </div>
      )}
    </div>
  );
};
