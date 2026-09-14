import {
  ClubActionPathAffinity,
  type ClubActionRequirement,
} from "@/features/actions/actionTypes";
import type { PresidentAttributeKey } from "@/features/clubPresidents/clubPresidentTypes";
import {
  getPresidentAttributeBadgeClass,
  presidentAttributeAccents,
} from "@/features/clubPresidents/utils/presidentAttributePresentation";

export { cashAccent } from "@/core/utils/cashPresentation";

export const legitimacyAccent = {
  text: "text-violet-400",
  badge: "border-violet-400/30 bg-violet-400/10 text-violet-400",
  badgeStrong: "border-violet-400/30 bg-violet-400/20 text-violet-400",
  bar: "bg-violet-400",
  barTrack: "bg-violet-400/20",
  border: "border-violet-400/30",
} as const;

export const infamyAccent = {
  text: "text-secondary",
  badge: "border-secondary/30 bg-secondary/10 text-secondary",
  bar: "bg-secondary",
  barTrack: "bg-secondary/20",
} as const;

const requirementChipUnmetClass =
  "border-outline-variant bg-surface-variant text-on-surface-variant";

/** Honorable gameplay path — teal, aligned with Integrity attribute bars/chips. */
export const integrityPathAccent = {
  badge: presidentAttributeAccents.integrity.badge,
} as const;

/** Neutral gameplay path — sky, distinct from Gray Area (gold) and Integrity (teal). */
export const flexiblePathAccent = {
  badge: presidentAttributeAccents.connections.badge,
} as const;

/** High-tier honorable unlock — aligned with legitimacy (violet) tier. */
export const honorablePowerAccent = {
  badge: legitimacyAccent.badgeStrong,
  text: legitimacyAccent.text,
} as const;

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

export const getPathAffinityShortLabel = (affinity: ClubActionPathAffinity): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return "Integrity";
    case ClubActionPathAffinity.Shady:
      return "Cunning";
    default:
      return "Flexible";
  }
};

export const getPathAffinityShortBadgeClass = (
  affinity: ClubActionPathAffinity,
): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return integrityPathAccent.badge;
    case ClubActionPathAffinity.Shady:
      return "border-secondary/30 bg-secondary/20 text-secondary";
    default:
      return flexiblePathAccent.badge;
  }
};

export const getRequirementIcon = (key: string): string => {
  switch (key) {
    case "charisma":
      return "psychology";
    case "authority":
      return "gavel";
    case "integrity":
      return "verified_user";
    case "cunning":
      return "visibility_off";
    case "connections":
      return "hub";
    case "legitimacy":
      return "verified";
    case "infamy":
      return "local_fire_department";
    default:
      return "lock";
  }
};

export const getPathAffinityBadgeClass = (affinity: ClubActionPathAffinity): string => {
  switch (affinity) {
    case ClubActionPathAffinity.Honorable:
      return integrityPathAccent.badge;
    case ClubActionPathAffinity.Shady:
      return "border-secondary/30 bg-secondary/10 text-secondary";
    default:
      return flexiblePathAccent.badge;
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
  if (!requirement.isMet) {
    return requirementChipUnmetClass;
  }

  if (requirement.key === "legitimacy") {
    return legitimacyAccent.badge;
  }

  if (requirement.key === "infamy") {
    return infamyAccent.badge;
  }

  if (requirement.key in presidentAttributeAccents) {
    return getPresidentAttributeBadgeClass(requirement.key as PresidentAttributeKey);
  }

  return presidentAttributeAccents.charisma.badge;
};

export type ActionLockedTone =
  | "cooldown"
  | "fixture"
  | "blocked"
  | "requirement"
  | "funds"
  | "default";

type ActionLockedPresentation = {
  tone: ActionLockedTone;
  buttonClassName: string;
  iconClassName: string;
};

const lockedButtonFromAccent = (
  borderBgText: { border: string; bg: string; text: string },
): Pick<ActionLockedPresentation, "buttonClassName" | "iconClassName"> => {
  return {
    buttonClassName: `${borderBgText.border} ${borderBgText.bg} ${borderBgText.text}`,
    iconClassName: borderBgText.text,
  };
};

const requirementLockedStyles: Record<
  string,
  { border: string; bg: string; text: string }
> = {
  charisma: {
    border: "border-primary/60",
    bg: "bg-primary/20",
    text: "text-primary",
  },
  authority: {
    border: "border-orange-400/60",
    bg: "bg-orange-400/20",
    text: "text-orange-400",
  },
  integrity: {
    border: "border-teal-400/60",
    bg: "bg-teal-400/20",
    text: "text-teal-400",
  },
  cunning: {
    border: "border-tertiary/60",
    bg: "bg-tertiary/20",
    text: "text-tertiary",
  },
  connections: {
    border: "border-sky-400/60",
    bg: "bg-sky-400/20",
    text: "text-sky-400",
  },
  legitimacy: {
    border: "border-violet-400/60",
    bg: "bg-violet-400/20",
    text: "text-violet-400",
  },
  infamy: {
    border: "border-secondary/60",
    bg: "bg-secondary/20",
    text: "text-secondary",
  },
  funds: {
    border: "border-primary/60",
    bg: "bg-primary/20",
    text: "text-primary",
  },
};

const getRequirementLockedPresentation = (
  reason: string | null | undefined,
): ActionLockedPresentation | null => {
  const normalized = (reason ?? "").toLowerCase();

  if (
    normalized.includes("insufficient funds")
    || normalized.includes("promised bonus")
    || normalized.includes("cash is locked")
  ) {
    return {
      tone: "funds",
      ...lockedButtonFromAccent(requirementLockedStyles.funds),
    };
  }

  if (normalized.includes("legitimacy")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.legitimacy),
    };
  }

  if (normalized.includes("infamy")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.infamy),
    };
  }

  if (normalized.includes("charisma")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.charisma),
    };
  }

  if (normalized.includes("authority")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.authority),
    };
  }

  if (normalized.includes("integrity")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.integrity),
    };
  }

  if (normalized.includes("cunning")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.cunning),
    };
  }

  if (normalized.includes("connections")) {
    return {
      tone: "requirement",
      ...lockedButtonFromAccent(requirementLockedStyles.connections),
    };
  }

  return null;
};

export const getActionLockedTone = (
  reason: string | null | undefined,
): ActionLockedTone => {
  const requirement = getRequirementLockedPresentation(reason);

  if (requirement) {
    return requirement.tone;
  }

  const normalized = (reason ?? "").toLowerCase();

  if (normalized.includes("cooldown")) {
    return "cooldown";
  }

  if (
    normalized.includes("fixture")
    || normalized.includes("playing at home")
    || normalized.includes("already used")
    || normalized.includes("already promised")
    || normalized.includes("espionage already")
  ) {
    return "fixture";
  }

  if (
    normalized.includes("locked")
    || normalized.includes("fair play")
  ) {
    return "blocked";
  }

  return "default";
};

export const getActionLockedPresentation = (
  reason: string | null | undefined,
): ActionLockedPresentation => {
  const requirement = getRequirementLockedPresentation(reason);

  if (requirement) {
    return requirement;
  }

  const tone = getActionLockedTone(reason);

  switch (tone) {
    case "cooldown":
      return {
        tone,
        buttonClassName: "border-error/60 bg-error/20 text-error",
        iconClassName: "text-error",
      };
    case "fixture":
      return {
        tone,
        buttonClassName:
          "border-secondary/60 bg-secondary/20 text-secondary-fixed",
        iconClassName: "text-secondary",
      };
    case "blocked":
      return {
        tone,
        buttonClassName: "border-tertiary/50 bg-tertiary/15 text-tertiary",
        iconClassName: "text-tertiary",
      };
    default:
      return {
        tone,
        buttonClassName:
          "border-outline bg-surface-container-lowest text-on-surface",
        iconClassName: "text-on-surface-variant",
      };
  }
};
