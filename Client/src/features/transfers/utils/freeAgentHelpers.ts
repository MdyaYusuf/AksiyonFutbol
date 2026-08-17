import type { DraftTier } from "../../basePlayers/basePlayerTypes";

export const DRAFT_TIER_LABELS: Record<DraftTier, string> = {
  1: "Gold",
  2: "Silver",
  3: "Bronze",
  4: "Iron",
};

export const getDraftTierBadgeClassName = (tier: DraftTier): string => {
  if (tier === 1) {
    return "border-primary/30 bg-primary-container/20 text-primary";
  }

  if (tier === 2) {
    return "border-secondary/30 bg-secondary/15 text-secondary";
  }

  if (tier === 3) {
    return "border-outline-variant bg-surface-bright text-on-surface";
  }

  return "border-outline-variant/70 bg-surface-container-low text-on-surface-variant";
};

export type FreeAgentSortOption =
  | "rating-desc"
  | "fee-asc"
  | "fee-desc"
  | "age-asc"
  | "age-desc"
  | "tier-asc";

export const FREE_AGENT_SORT_OPTIONS: {
  value: FreeAgentSortOption;
  label: string;
}[] = [
  { value: "rating-desc", label: "Sort by: Rating (Desc)" },
  { value: "fee-asc", label: "Sort by: Fee (Asc)" },
  { value: "fee-desc", label: "Sort by: Fee (Desc)" },
  { value: "age-asc", label: "Sort by: Age (Asc)" },
  { value: "age-desc", label: "Sort by: Age (Desc)" },
  { value: "tier-asc", label: "Sort by: Tier (Asc)" },
];

export const freeAgentSortOptionToApi = (
  sort: FreeAgentSortOption,
): { sortBy: string; sortDescending: boolean } => {
  if (sort === "rating-desc") {
    return { sortBy: "rating", sortDescending: true };
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
