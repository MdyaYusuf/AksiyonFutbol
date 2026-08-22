import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import type { SquadPositionFilter } from "../../playerInstances/utils/squadHelpers";
import { formatSquadMoney } from "../../playerInstances/utils/squadHelpers";

export type TransferMarketSortOption =
  | "rating-desc"
  | "rating-asc"
  | "value-asc"
  | "value-desc"
  | "age-asc"
  | "age-desc"
  | "tier-asc"
  | "tier-desc"
  | "asking-desc";

export const TRANSFER_POSITION_FILTERS: SquadPositionFilter[] = [
  "ALL",
  "FWD",
  "MID",
  "DEF",
  "GK",
];

export const TRANSFER_SORT_OPTIONS: {
  value: TransferMarketSortOption;
  label: string;
}[] = [
  { value: "rating-desc", label: "Sort by: Rating (Desc)" },
  { value: "rating-asc", label: "Sort by: Rating (Asc)" },
  { value: "value-asc", label: "Sort by: Value (Asc)" },
  { value: "value-desc", label: "Sort by: Value (Desc)" },
  { value: "age-asc", label: "Sort by: Age (Asc)" },
  { value: "age-desc", label: "Sort by: Age (Desc)" },
  { value: "tier-asc", label: "Sort by: Tier (Asc)" },
  { value: "tier-desc", label: "Sort by: Tier (Desc)" },
  { value: "asking-desc", label: "Sort by: Asking Price (Desc)" },
];

export const positionFilterToApi = (
  filter: SquadPositionFilter,
): PlayerPosition | undefined => {
  if (filter === "GK") {
    return PlayerPosition.Goalkeeper;
  }

  if (filter === "DEF") {
    return PlayerPosition.Defender;
  }

  if (filter === "MID") {
    return PlayerPosition.Midfielder;
  }

  if (filter === "FWD") {
    return PlayerPosition.Forward;
  }

  return undefined;
};

export const sortOptionToApi = (
  sort: TransferMarketSortOption,
): { sortBy: string; sortDescending: boolean } => {
  if (sort === "rating-desc") {
    return { sortBy: "overall", sortDescending: true };
  }

  if (sort === "rating-asc") {
    return { sortBy: "overall", sortDescending: false };
  }

  if (sort === "value-asc") {
    return { sortBy: "marketvalue", sortDescending: false };
  }

  if (sort === "value-desc") {
    return { sortBy: "marketvalue", sortDescending: true };
  }

  if (sort === "age-asc") {
    return { sortBy: "age", sortDescending: false };
  }

  if (sort === "age-desc") {
    return { sortBy: "age", sortDescending: true };
  }

  if (sort === "tier-asc") {
    return { sortBy: "tier", sortDescending: false };
  }

  if (sort === "tier-desc") {
    return { sortBy: "tier", sortDescending: true };
  }

  return { sortBy: "askingprice", sortDescending: true };
};

export const formatMarketPosition = (position: string): string => {
  const normalized = position.trim().toLowerCase();

  if (normalized === "goalkeeper" || normalized === "1") {
    return "GK";
  }

  if (normalized === "defender" || normalized === "2") {
    return "DEF";
  }

  if (normalized === "midfielder" || normalized === "3") {
    return "MID";
  }

  if (normalized === "forward" || normalized === "4") {
    return "FWD";
  }

  return position.toUpperCase().slice(0, 3);
};

export const formatTransferWage = (amount: number): string => {
  return `${formatSquadMoney(amount)}/w`;
};

export const getRatingBadgeClassName = (overallRating: number): string => {
  if (overallRating >= 85) {
    return "border-primary/30 bg-primary-container/20 text-primary";
  }

  return "border-outline-variant bg-surface-bright text-on-surface";
};
