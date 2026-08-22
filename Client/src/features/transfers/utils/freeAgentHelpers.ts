import type { DraftTier } from "../../basePlayers/basePlayerTypes";

export const DRAFT_TIER_LABELS: Record<DraftTier, string> = {
  1: "Gold",
  2: "Silver",
  3: "Bronze",
  4: "Iron",
};

export const getDraftTierBadgeClassName = (tier: DraftTier): string => {
  if (tier === 1) {
    return "border-secondary/50 bg-transparent text-secondary";
  }

  if (tier === 2) {
    return "border-sky-500/45 bg-transparent text-sky-400";
  }

  if (tier === 3) {
    return "border-tertiary/50 bg-transparent text-tertiary";
  }

  return "border-teal-400/45 bg-transparent text-teal-300";
};

export const getDraftTierFilterChipClassName = (
  tier: DraftTier | "ALL",
  isActive: boolean,
): string => {
  if (tier === "ALL") {
    if (isActive) {
      return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-primary bg-primary/10 text-primary";
    }

    return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-outline-variant bg-surface-container text-on-surface-variant hover:border-primary hover:text-primary";
  }

  if (tier === 1) {
    if (isActive) {
      return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-secondary/60 bg-transparent text-secondary";
    }

    return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-outline-variant bg-transparent text-on-surface-variant hover:border-secondary hover:text-secondary";
  }

  if (tier === 2) {
    if (isActive) {
      return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-sky-500/55 bg-transparent text-sky-400";
    }

    return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-outline-variant bg-transparent text-on-surface-variant hover:border-sky-500 hover:text-sky-400";
  }

  if (tier === 3) {
    if (isActive) {
      return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-tertiary/60 bg-transparent text-tertiary";
    }

    return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-outline-variant bg-transparent text-on-surface-variant hover:border-tertiary hover:text-tertiary";
  }

  if (isActive) {
    return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-teal-400/55 bg-transparent text-teal-300";
  }

  return "rounded-full border px-3 py-1 font-label-caps text-label-caps transition-colors border-outline-variant bg-transparent text-on-surface-variant hover:border-teal-400 hover:text-teal-300";
};

export type FreeAgentSortOption =
  | "rating-desc"
  | "rating-asc"
  | "fee-asc"
  | "fee-desc"
  | "age-asc"
  | "age-desc"
  | "tier-asc"
  | "tier-desc";

export const FREE_AGENT_SORT_OPTIONS: {
  value: FreeAgentSortOption;
  label: string;
}[] = [
  { value: "rating-desc", label: "Sort by: Rating (Desc)" },
  { value: "rating-asc", label: "Sort by: Rating (Asc)" },
  { value: "fee-asc", label: "Sort by: Fee (Asc)" },
  { value: "fee-desc", label: "Sort by: Fee (Desc)" },
  { value: "age-asc", label: "Sort by: Age (Asc)" },
  { value: "age-desc", label: "Sort by: Age (Desc)" },
  { value: "tier-asc", label: "Sort by: Tier (Asc)" },
  { value: "tier-desc", label: "Sort by: Tier (Desc)" },
];

export const freeAgentSortOptionToApi = (
  sort: FreeAgentSortOption,
): { sortBy: string; sortDescending: boolean } => {
  if (sort === "rating-desc") {
    return { sortBy: "rating", sortDescending: true };
  }

  if (sort === "rating-asc") {
    return { sortBy: "rating", sortDescending: false };
  }

  if (sort === "fee-asc") {
    return { sortBy: "fee", sortDescending: false };
  }

  if (sort === "fee-desc") {
    return { sortBy: "fee", sortDescending: true };
  }

  if (sort === "age-asc") {
    return { sortBy: "age", sortDescending: false };
  }

  if (sort === "age-desc") {
    return { sortBy: "age", sortDescending: true };
  }

  if (sort === "tier-desc") {
    return { sortBy: "tier", sortDescending: true };
  }

  return { sortBy: "tier", sortDescending: false };
};

export const FREE_AGENT_TIER_FILTERS: { value: DraftTier | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Tiers" },
  { value: 1, label: "Gold" },
  { value: 2, label: "Silver" },
  { value: 3, label: "Bronze" },
  { value: 4, label: "Iron" },
];

export const tierFilterToApi = (tier: DraftTier | "ALL"): DraftTier | undefined => {
  if (tier === "ALL") {
    return undefined;
  }

  return tier;
};
