import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import { ProgressBar } from "@/core/components/ui/ProgressBar";
import { useGetObjectivesContextQuery } from "@/features/objectives/objectivesApiSlice";
import { ObjectiveStatus, type ObjectiveProgress } from "@/features/objectives/objectiveTypes";
import {
  getObjectiveCategoryBadgeClass,
  getObjectiveCategoryLabel,
  getObjectiveProgressBarClass,
  getObjectiveStatusBadgeClass,
  getObjectiveStatusLabel,
  objectiveBadgeBaseClass,
} from "@/features/objectives/utils/objectivesPresentation";

const SNAPSHOT_LIMIT = 3;

const getProgressPercent = (objective: ObjectiveProgress): number => {
  if (objective.targetValue <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((objective.currentValue / objective.targetValue) * 100),
  );
};

const pickSnapshotObjectives = (
  objectives: ObjectiveProgress[],
): ObjectiveProgress[] => {
  const claimable = objectives.filter(
    (item) => item.status === ObjectiveStatus.Completed,
  );
  const active = objectives
    .filter((item) => item.status === ObjectiveStatus.Active)
    .sort((left, right) => getProgressPercent(right) - getProgressPercent(left));

  return [...claimable, ...active].slice(0, SNAPSHOT_LIMIT);
};

export const ObjectivesSnapshotCard = () => {
  const { data, isLoading, isError } = useGetObjectivesContextQuery();
  const snapshot = data ? pickSnapshotObjectives(data.objectives) : [];
  const claimableCount = data?.claimableCount ?? 0;

  return (
    <div className="col-span-1 flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-4 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-label-caps text-on-surface-variant">Objectives</h2>
          {claimableCount > 0 ? (
            <span className="rounded border border-primary/40 bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              {claimableCount} claimable
            </span>
          ) : null}
        </div>
        <Link to="/app/objectives" className="text-body-sm text-primary hover:underline">
          Open Hub
        </Link>
      </div>

      {isLoading ? (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          Loading objectives...
        </p>
      ) : null}

      {isError ? (
        <p className="py-6 text-center text-body-sm text-error">
          Objectives could not be loaded.
        </p>
      ) : null}

      {!isLoading && !isError && snapshot.length === 0 ? (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          No active objectives yet. Open the hub after your club is set up.
        </p>
      ) : null}

      {!isLoading && !isError && snapshot.length > 0 ? (
        <div className="flex flex-1 flex-col gap-2">
          {snapshot.map((objective) => {
            const progressPercent = getProgressPercent(objective);
            const progressBar = getObjectiveProgressBarClass(objective.status);

            return (
              <Link
                key={objective.key}
                to="/app/objectives"
                className="rounded border border-outline-variant bg-background p-3 transition-colors hover:border-primary/40 hover:bg-surface-container"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="truncate font-body-sm text-body-sm font-semibold text-on-surface">
                    {objective.displayName}
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
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span
                    className={[
                      objectiveBadgeBaseClass,
                      getObjectiveCategoryBadgeClass(objective.category),
                    ].join(" ")}
                  >
                    {getObjectiveCategoryLabel(objective.category)}
                  </span>
                  <span className="font-data-mono text-xs text-on-surface-variant">
                    {objective.currentValue}/{objective.targetValue}
                  </span>
                </div>
                <ProgressBar
                  value={progressPercent}
                  colorClassName={progressBar.colorClassName}
                  trackClassName={progressBar.trackClassName}
                />
                {objective.status === ObjectiveStatus.Completed ? (
                  <div className="mt-2 inline-flex items-center gap-1 text-body-sm font-semibold text-primary">
                    <MaterialIcon name="redeem" className="text-[16px]" />
                    Ready to claim
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
