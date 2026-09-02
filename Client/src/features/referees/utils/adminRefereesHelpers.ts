import {
  RefereePersonalityType,
  type RefereeResponse,
} from "@/features/referees/refereeTypes";

export type RefereePersonalityFilter = "ALL" | RefereePersonalityType;

export const PERSONALITY_OPTIONS: {
  value: RefereePersonalityType;
  label: string;
  shortLabel: string;
}[] = [
  {
    value: RefereePersonalityType.Balanced,
    label: "Neutral (Balanced)",
    shortLabel: "Neutral",
  },
  {
    value: RefereePersonalityType.Lenient,
    label: "Lenient (Forgiving)",
    shortLabel: "Lenient",
  },
  {
    value: RefereePersonalityType.Strict,
    label: "Strict (Authoritative)",
    shortLabel: "Strict",
  },
  {
    value: RefereePersonalityType.Showman,
    label: "Showman (Dramatic)",
    shortLabel: "Showman",
  },
  {
    value: RefereePersonalityType.Corruptible,
    label: "Corruptible (Susceptible)",
    shortLabel: "Corruptible",
  },
];

export const getPersonalityLabel = (
  personalityType: RefereePersonalityType,
): string => {
  return (
    PERSONALITY_OPTIONS.find((option) => option.value === personalityType)
      ?.shortLabel ?? "Unknown"
  );
};

export const getPersonalityBadgeClassName = (
  personalityType: RefereePersonalityType,
): string => {
  switch (personalityType) {
    case RefereePersonalityType.Strict:
      return "bg-error-container/20 text-error border border-error/20";
    case RefereePersonalityType.Showman:
      return "bg-secondary-container/20 text-secondary border border-secondary/20";
    case RefereePersonalityType.Lenient:
      return "bg-primary-container/20 text-primary border border-primary/20";
    case RefereePersonalityType.Corruptible:
      return "bg-tertiary-container/20 text-tertiary border border-tertiary/20";
    case RefereePersonalityType.Balanced:
    default:
      return "bg-surface-variant text-on-surface-variant border border-outline-variant";
  }
};

export const getBriberyBarClassName = (difficulty: number): string => {
  if (difficulty >= 80) {
    return "bg-error";
  }

  if (difficulty >= 50) {
    return "bg-secondary";
  }

  if (difficulty >= 30) {
    return "bg-on-surface-variant";
  }

  return "bg-primary";
};

export const getBriberyTextClassName = (difficulty: number): string => {
  if (difficulty >= 80) {
    return "text-error";
  }

  if (difficulty >= 50) {
    return "text-secondary";
  }

  if (difficulty >= 30) {
    return "text-on-surface-variant";
  }

  return "text-primary";
};

export const filterReferees = (
  referees: RefereeResponse[],
  searchQuery: string,
  personalityFilter: RefereePersonalityFilter,
): RefereeResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return referees.filter((referee) => {
    if (
      personalityFilter !== "ALL" &&
      referee.personalityType !== personalityFilter
    ) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const name = referee.name.toLowerCase();
    const biography = referee.biography?.toLowerCase() ?? "";

    return name.includes(normalizedQuery) || biography.includes(normalizedQuery);
  });
};
