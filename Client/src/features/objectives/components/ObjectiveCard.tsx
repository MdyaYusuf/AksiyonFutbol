import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { ProgressBar } from "@/core/components/ui/ProgressBar";
import { ActionExecuteButton } from "@/features/actions/components/ActionExecuteButton";
import type { ObjectiveProgress } from "@/features/objectives/objectiveTypes";
import { ObjectiveStatus } from "@/features/objectives/objectiveTypes";
import {
  formatObjectiveRewardSummary,
  getObjectiveCategoryLabel,
  getObjectiveStatusLabel,
  getObjectiveTrackBadgeClass,
  getObjectiveTrackLabel,
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

  return (
    <div className="flex flex-col rounded border border-outline-variant bg-surface-container-high p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {objective.displayName}
          </h3>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {objective.description}
          </p>
        </div>
        <span className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {getObjectiveCategoryLabel(objective.category)}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <span
          className={[
            "rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            getObjectiveTrackBadgeClass(objective.trackAffinity),
          ].join(" ")}
        >
          {getObjectiveTrackLabel(objective.trackAffinity)}
        </span>
        <span className="rounded border border-outline-variant bg-surface-variant px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {getObjectiveStatusLabel(objective.status)}
        </span>
      </div>

      <div className="mb-2 flex items-end justify-between gap-2">
        <span className="font-body-sm text-body-sm text-on-surface-variant">Progress</span>
        <span className="font-data-mono text-data-mono text-on-surface">
          {objective.currentValue}/{objective.targetValue}
        </span>
      </div>
      <ProgressBar value={progressPercent} />

      <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant">
        Reward: {formatObjectiveRewardSummary(objective)}
      </p>

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
        ) : objective.status === ObjectiveStatus.Claimed ? (
          <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-3 py-2 font-body-sm text-body-sm font-semibold text-primary">
            <MaterialIcon name="check_circle" className="text-[16px]" />
            Claimed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded border border-outline-variant bg-surface-variant px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
            <MaterialIcon name="flag" className="text-[16px]" />
            In progress
          </span>
        )}
      </div>
    </div>
  );
};
