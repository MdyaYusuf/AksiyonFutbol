import {
  ObjectiveCategory,
  ObjectiveStatus,
  ObjectiveTrackAffinity,
  type ObjectiveProgress,
} from "@/features/objectives/objectiveTypes";

export type ObjectivesFilter = "all" | "active" | "claimable" | "claimed";

export const getObjectiveCategoryLabel = (category: ObjectiveCategory): string => {
  if (category === ObjectiveCategory.Match) {
    return "Match";
  }

  if (category === ObjectiveCategory.Actions) {
    return "Actions";
  }

  if (category === ObjectiveCategory.Identity) {
    return "Identity";
  }

  return "Club";
};

export const getObjectiveTrackLabel = (affinity: ObjectiveTrackAffinity): string => {
  if (affinity === ObjectiveTrackAffinity.Honorable) {
    return "Integrity";
  }

  if (affinity === ObjectiveTrackAffinity.Shady) {
    return "Cunning";
  }

  return "Any path";
};

export const getObjectiveTrackBadgeClass = (affinity: ObjectiveTrackAffinity): string => {
  if (affinity === ObjectiveTrackAffinity.Honorable) {
    return "border-teal-400/30 bg-teal-400/10 text-teal-400";
  }

  if (affinity === ObjectiveTrackAffinity.Shady) {
    return "border-secondary/30 bg-secondary/20 text-secondary";
  }

  return "border-outline-variant bg-surface-variant text-on-surface-variant";
};

export const getObjectiveStatusLabel = (status: ObjectiveStatus): string => {
  if (status === ObjectiveStatus.Completed) {
    return "Ready to claim";
  }

  if (status === ObjectiveStatus.Claimed) {
    return "Claimed";
  }

  return "In progress";
};

export const filterObjectives = (
  objectives: ObjectiveProgress[],
  filter: ObjectivesFilter,
): ObjectiveProgress[] => {
  if (filter === "active") {
    return objectives.filter((item) => item.status === ObjectiveStatus.Active);
  }

  if (filter === "claimable") {
    return objectives.filter((item) => item.status === ObjectiveStatus.Completed);
  }

  if (filter === "claimed") {
    return objectives.filter((item) => item.status === ObjectiveStatus.Claimed);
  }

  return objectives;
};

export const formatObjectiveRewardSummary = (objective: ObjectiveProgress): string => {
  const parts: string[] = [];
  const reward = objective.reward;

  if (reward.cashReward > 0) {
    parts.push(`$${Math.round(reward.cashReward).toLocaleString("en-US")}`);
  }

  if (reward.legitimacyReward > 0) {
    parts.push(`+${reward.legitimacyReward} Legitimacy`);
  }

  if (reward.infamyReward > 0) {
    parts.push(`+${reward.infamyReward} Infamy`);
  }

  if (reward.titleDisplayName) {
    parts.push(`Title: ${reward.titleDisplayName}`);
  }

  if (parts.length === 0) {
    return "No reward listed";
  }

  return parts.join(" · ");
};
