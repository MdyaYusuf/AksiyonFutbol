import { useState } from "react";
import {
  useClaimObjectiveMutation,
  useEquipTitleMutation,
  useGetObjectivesContextQuery,
} from "@/features/objectives/objectivesApiSlice";
import { ObjectiveCard } from "@/features/objectives/components/ObjectiveCard";
import { ObjectivesTitlesPanel } from "@/features/objectives/components/ObjectivesTitlesPanel";
import type { ObjectiveProgress } from "@/features/objectives/objectiveTypes";
import {
  filterObjectives,
  getObjectivesFilterButtonClass,
  type ObjectivesFilter,
} from "@/features/objectives/utils/objectivesPresentation";

const FILTERS: { id: ObjectivesFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "claimable", label: "Ready to claim" },
  { id: "active", label: "In progress" },
  { id: "claimed", label: "Claimed" },
];

export const ObjectivesHubPage = () => {
  const { data, isLoading, isError } = useGetObjectivesContextQuery();
  const [claimObjective, { isLoading: isClaiming }] = useClaimObjectiveMutation();
  const [equipTitle, { isLoading: isEquipping }] = useEquipTitleMutation();
  const [filter, setFilter] = useState<ObjectivesFilter>("all");
  const [claimingKey, setClaimingKey] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Loading objectives...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-on-surface-variant">
        Objectives could not be loaded.
      </div>
    );
  }

  const visible = filterObjectives(data.objectives, filter);
  const hasClaimable = data.claimableCount > 0;

  const handleClaim = async (objective: ObjectiveProgress) => {
    setClaimingKey(objective.key);

    try {
      await claimObjective({ objectiveKey: objective.key }).unwrap();
    } catch {
      /* Toasts via apiClient */
    } finally {
      setClaimingKey(null);
    }
  };

  const handleEquip = async (titleKey: string) => {
    try {
      await equipTitle({ titleKey }).unwrap();
    } catch {
      /* Toasts via apiClient */
    }
  };

  let claimStatShellClass =
    "rounded-lg border border-outline-variant bg-surface-container-high px-4 py-3";
  let claimStatLabelClass = "font-label-caps text-label-caps text-on-surface-variant";
  let claimStatValueClass = "font-stat-value text-stat-value text-on-surface-variant";

  if (hasClaimable) {
    claimStatShellClass = "rounded-lg border border-primary/40 bg-primary/10 px-4 py-3";
    claimStatLabelClass = "font-label-caps text-label-caps text-primary";
    claimStatValueClass = "font-stat-value text-stat-value text-primary";
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div className="flex flex-col justify-between gap-4 border-b border-outline-variant pb-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-display-lg text-display-lg font-extrabold text-on-surface">
            Objectives
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Track career goals, claim rewards, and equip titles earned on Integrity or
            Cunning paths.
          </p>
        </div>
        <div className={claimStatShellClass}>
          <div className={claimStatLabelClass}>Ready to claim</div>
          <div className={claimStatValueClass}>{data.claimableCount}</div>
        </div>
      </div>

      <ObjectivesTitlesPanel
        titles={data.titles}
        equippedTitle={data.equippedTitle}
        isEquipping={isEquipping}
        onEquip={handleEquip}
      />

      <div className="flex flex-wrap gap-2 rounded-lg border border-[#334155] bg-surface-container p-1">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setFilter(item.id);
            }}
            className={getObjectivesFilterButtonClass(item.id, filter === item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          No objectives in this filter.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-card-gap xl:grid-cols-2">
          {visible.map((objective) => (
            <ObjectiveCard
              key={objective.key}
              objective={objective}
              isClaiming={isClaiming && claimingKey === objective.key}
              onClaim={handleClaim}
            />
          ))}
        </div>
      )}
    </div>
  );
};
