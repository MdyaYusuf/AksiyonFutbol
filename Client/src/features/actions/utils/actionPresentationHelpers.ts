import {
  ClubActionPathAffinity,
  type ClubActionRequirement,
} from "@/features/actions/actionTypes";

export const getPathAffinityLabel = (affinity: ClubActionPathAffinity): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return "Integrity path";
    case ClubActionPathAffinity.Shady:
      return "Cunning path";
    default:
      return "Flexible path";
  }
};

export const getPathAffinityBadgeClass = (affinity: ClubActionPathAffinity): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return "border-primary/30 bg-primary/10 text-primary";
    case ClubActionPathAffinity.Shady:
      return "border-secondary/30 bg-secondary/10 text-secondary";
    default:
      return "border-outline-variant bg-surface-container-highest text-on-surface-variant";
  }
};

export const getPathAffinityIcon = (affinity: ClubActionPathAffinity): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return "verified";
    case ClubActionPathAffinity.Shady:
      return "visibility_off";
    default:
      return "tune";
  }
};

export const formatMoralityDelta = (value: number): string => {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
};

export const getRequirementChipClass = (requirement: ClubActionRequirement): string => {
  if (requirement.isMet) {
    return "border-primary/30 bg-primary/10 text-primary";
  }

  return "border-outline-variant bg-surface-variant text-on-surface-variant";
};
