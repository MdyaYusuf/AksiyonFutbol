import {
  cashAccent,
  infamyAccent,
  integrityPathAccent,
  legitimacyAccent,
} from "@/features/actions/utils/actionPresentationHelpers";
import {
  ObjectiveCategory,
  ObjectiveStatus,
  ObjectiveTrackAffinity,
  type ObjectiveProgress,
} from "@/features/objectives/objectiveTypes";

export type ObjectivesFilter = "all" | "active" | "claimable" | "claimed";

export const objectiveBadgeBaseClass =
  "rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider";

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

export const getObjectiveCategoryBadgeClass = (
  category: ObjectiveCategory,
): string => {
  if (category === ObjectiveCategory.Match) {
    return "border-orange-400/30 bg-orange-400/10 text-orange-400";
  }

  if (category === ObjectiveCategory.Actions) {
    return "border-tertiary/30 bg-tertiary/10 text-tertiary";
  }

  if (category === ObjectiveCategory.Identity) {
    return legitimacyAccent.badge;
  }

  return "border-sky-400/30 bg-sky-400/10 text-sky-400";
};

export const getObjectiveTrackLabel = (affinity: ObjectiveTrackAffinity): string => {
  if (affinity === ObjectiveTrackAffinity.Honorable) {
    return "Integrity";
  }

  if (affinity === ObjectiveTrackAffinity.Shady) {
    return "Cunning";
  }

  return "Flexible";
};

/** Neutral / any-path — indigo, distinct from In progress (sky). */
const flexibleTrackAccent = {
  badge: "border-indigo-400/30 bg-indigo-400/10 text-indigo-400",
} as const;

export const getObjectiveTrackBadgeClass = (
  affinity: ObjectiveTrackAffinity,
): string => {
  if (affinity === ObjectiveTrackAffinity.Honorable) {
    return integrityPathAccent.badge;
  }

  if (affinity === ObjectiveTrackAffinity.Shady) {
    return "border-secondary/30 bg-secondary/20 text-secondary";
  }

  return flexibleTrackAccent.badge;
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

/** Active / in-progress — sky (same family as Actions Flexible path). */
const inProgressAccent = {
  badge: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  text: "text-sky-400",
  bar: "bg-sky-400",
  barTrack: "bg-sky-400/20",
  filterActive: "border border-sky-400/40 bg-sky-400/20 text-sky-400",
  footer:
    "inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-400/15 px-4 py-2 font-label-caps text-label-caps text-sky-400",
} as const;

export const getObjectiveStatusBadgeClass = (status: ObjectiveStatus): string => {
  if (status === ObjectiveStatus.Completed) {
    return cashAccent.chip;
  }

  if (status === ObjectiveStatus.Claimed) {
    return legitimacyAccent.badge;
  }

  return inProgressAccent.badge;
};

export const getObjectiveInProgressFooterClass = (): string => {
  return inProgressAccent.footer;
};

export const getObjectiveProgressValueClass = (status: ObjectiveStatus): string => {
  if (status === ObjectiveStatus.Completed) {
    return "font-data-mono text-data-mono text-primary";
  }

  if (status === ObjectiveStatus.Claimed) {
    return "font-data-mono text-data-mono text-violet-400";
  }

  return `font-data-mono text-data-mono ${inProgressAccent.text}`;
};

export const getObjectiveProgressBarClass = (
  status: ObjectiveStatus,
): { colorClassName: string; trackClassName: string } => {
  if (status === ObjectiveStatus.Completed) {
    return {
      colorClassName: "bg-primary",
      trackClassName: "bg-primary/20",
    };
  }

  if (status === ObjectiveStatus.Claimed) {
    return {
      colorClassName: legitimacyAccent.bar,
      trackClassName: legitimacyAccent.barTrack,
    };
  }

  return {
    colorClassName: inProgressAccent.bar,
    trackClassName: inProgressAccent.barTrack,
  };
};

export const getObjectiveCardShellClass = (status: ObjectiveStatus): string => {
  const base =
    "group flex flex-col rounded border bg-surface-container-high p-4 transition-colors hover:bg-[#334155]";

  if (status === ObjectiveStatus.Completed) {
    return `${base} border-primary/40`;
  }

  if (status === ObjectiveStatus.Claimed) {
    return `${base} border-violet-400/30`;
  }

  return `${base} border-[#334155]`;
};

export const getObjectivesFilterButtonClass = (
  filterId: ObjectivesFilter,
  isActive: boolean,
): string => {
  const base =
    "rounded px-4 py-2 font-label-caps text-label-caps transition-colors";

  if (!isActive) {
    return `${base} text-on-surface-variant hover:bg-surface-variant`;
  }

  if (filterId === "claimable") {
    return `${base} bg-primary text-on-primary`;
  }

  if (filterId === "active") {
    return `${base} ${inProgressAccent.filterActive}`;
  }

  if (filterId === "claimed") {
    return `${base} border border-violet-400/40 bg-violet-400/20 text-violet-400`;
  }

  return `${base} bg-primary text-on-primary`;
};

export type ObjectiveRewardChip = {
  key: string;
  className: string;
  kind: "cash" | "text";
  label?: string;
  cashAmount?: number;
};

export const getObjectiveRewardChips = (
  objective: ObjectiveProgress,
): ObjectiveRewardChip[] => {
  const reward = objective.reward;
  const chips: ObjectiveRewardChip[] = [];

  if (reward.cashReward > 0) {
    chips.push({
      key: "cash",
      className: cashAccent.chip,
      kind: "cash",
      cashAmount: reward.cashReward,
    });
  }

  if (reward.legitimacyReward > 0) {
    chips.push({
      key: "leg",
      className: legitimacyAccent.badge,
      kind: "text",
      label: `+${reward.legitimacyReward} Legitimacy`,
    });
  }

  if (reward.infamyReward > 0) {
    chips.push({
      key: "inf",
      className: infamyAccent.badge,
      kind: "text",
      label: `+${reward.infamyReward} Infamy`,
    });
  }

  if (reward.titleDisplayName) {
    chips.push({
      key: "title",
      className: "border-secondary/30 bg-secondary/20 text-secondary",
      kind: "text",
      label: `Title: ${reward.titleDisplayName}`,
    });
  }

  return chips;
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
