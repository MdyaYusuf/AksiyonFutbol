import { CashAmount } from "@/core/components/ui/CashAmount";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { ProgressBar } from "@/core/components/ui/ProgressBar";
import { ActionExecuteButton } from "@/features/actions/components/ActionExecuteButton";
import type { ObjectiveProgress } from "@/features/objectives/objectiveTypes";
import { ObjectiveStatus } from "@/features/objectives/objectiveTypes";
import {
  getObjectiveCardShellClass,
  getObjectiveCategoryBadgeClass,
  getObjectiveCategoryLabel,
  getObjectiveInProgressFooterClass,
  getObjectiveProgressBarClass,
  getObjectiveProgressValueClass,
  getObjectiveRewardChips,
  getObjectiveStatusBadgeClass,
  getObjectiveStatusLabel,
  getObjectiveTrackBadgeClass,
  getObjectiveTrackLabel,
  objectiveBadgeBaseClass,
} from "@/features/objectives/utils/objectivesPresentation";

interface ObjectiveCardProps {
  objective: ObjectiveProgress;
  isClaiming: boolean;
  onClaim: (objective: ObjectiveProgress) => void;
}

export const ObjectiveCard = ({
  objective,
  isClaiming,
  onClaim,
}: ObjectiveCardProps) => {
  const progressPercent =
    objective.targetValue <= 0
      ? 0
      : Math.min(100, Math.round((objective.currentValue / objective.targetValue) * 100));

  const canClaim = objective.status === ObjectiveStatus.Completed;
  const progressBar = getObjectiveProgressBarClass(objective.status);
  const rewardChips = getObjectiveRewardChips(objective);
  const progressValueClass = getObjectiveProgressValueClass(objective.status);

  return (
    <div className={getObjectiveCardShellClass(objective.status)}>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {objective.displayName}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {objective.description}
          </p>
        </div>
        <span
          className={[
            objectiveBadgeBaseClass,
            getObjectiveCategoryBadgeClass(objective.category),
          ].join(" ")}
        >
          {getObjectiveCategoryLabel(objective.category)}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={[
            objectiveBadgeBaseClass,
            getObjectiveTrackBadgeClass(objective.trackAffinity),
          ].join(" ")}
        >
          {getObjectiveTrackLabel(objective.trackAffinity)}
        </span>
        <span
          className={[
            objectiveBadgeBaseClass,
            getObjectiveStatusBadgeClass(objective.status),
          ].join(" ")}
        >
          {getObjectiveStatusLabel(objective.status)}
        </span>
      </div>

      <div className="mb-2 flex items-end justify-between gap-2">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Progress</span>
        <span className={progressValueClass}>
          {objective.currentValue}/{objective.targetValue}
        </span>
      </div>
      <ProgressBar
        value={progressPercent}
        colorClassName={progressBar.colorClassName}
        trackClassName={progressBar.trackClassName}
      />

      <div className="mt-3">
        <p className="mb-2 font-body-sm text-body-sm text-on-surface-variant">Reward</p>
        {rewardChips.length === 0 ? (
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            No reward listed
          </span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {rewardChips.map((chip) => (
              <span
                key={chip.key}
                className={[objectiveBadgeBaseClass, chip.className].join(" ")}
              >
                {chip.kind === "cash" && chip.cashAmount != null ? (
                  <CashAmount amount={chip.cashAmount} />
                ) : (
                  chip.label
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        {canClaim ? (
          <ActionExecuteButton
            disabled={isClaiming}
            onClick={() => {
              onClaim(objective);
            }}
          >
            {isClaiming ? "Claiming..." : "Claim Reward"}
          </ActionExecuteButton>
        ) : null}
        {!canClaim && objective.status === ObjectiveStatus.Claimed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-violet-400/40 bg-violet-400/15 px-4 py-2 font-label-caps text-label-caps text-violet-400">
            <MaterialIcon name="check_circle" className="text-[16px]" />
            Claimed
          </span>
        ) : null}
        {!canClaim && objective.status === ObjectiveStatus.Active ? (
          <span className={getObjectiveInProgressFooterClass()}>
            <MaterialIcon name="flag" className="text-[16px]" />
            In progress
          </span>
        ) : null}
      </div>
    </div>
  );
};
