import { DraftTier, PlayerPosition } from "@/features/basePlayers/basePlayerTypes";
import {
  getPositionFilterForPlayer,
  type SquadPositionFilter,
} from "@/features/playerInstances/utils/squadHelpers";
import type {
  ClubDraftState,
  DraftCatalogPlayer,
  DraftQuota,
} from "@/features/clubDrafts/clubDraftTypes";

export type DraftTierFilter = DraftTier | "ALL";

export type DraftCatalogSortColumn =
  | "player"
  | "nationality"
  | "position"
  | "foot"
  | "age"
  | "height"
  | "weight"
  | "overall"
  | "fee"
  | "wage";

export type DraftCatalogSortDirection = "asc" | "desc";

export interface DraftCatalogSort {
  column: DraftCatalogSortColumn;
  direction: DraftCatalogSortDirection;
}

export const DEFAULT_DRAFT_CATALOG_SORT: DraftCatalogSort = {
  column: "overall",
  direction: "desc",
};

export const DRAFT_TIER_FILTERS: { value: DraftTierFilter; label: string }[] = [
  { value: "ALL", label: "All Tiers" },
  { value: DraftTier.Gold, label: "Gold" },
  { value: DraftTier.Silver, label: "Silver" },
  { value: DraftTier.Bronze, label: "Bronze" },
  { value: DraftTier.Iron, label: "Iron" },
];

const compareDraftCatalogNames = (
  left: DraftCatalogPlayer,
  right: DraftCatalogPlayer,
): number => {
  const lastName = left.defaultLastName.localeCompare(right.defaultLastName);

  if (lastName !== 0) {
    return lastName;
  }

  return left.defaultFirstName.localeCompare(right.defaultFirstName);
};

const compareDraftCatalogColumn = (
  left: DraftCatalogPlayer,
  right: DraftCatalogPlayer,
  column: DraftCatalogSortColumn,
): number => {
  if (column === "player") {
    return compareDraftCatalogNames(left, right);
  }

  if (column === "nationality") {
    return (left.nationality ?? "").localeCompare(right.nationality ?? "");
  }

  if (column === "position") {
    return left.position - right.position;
  }

  if (column === "foot") {
    return left.preferredFoot - right.preferredFoot;
  }

  if (column === "age") {
    return left.age - right.age;
  }

  if (column === "height") {
    return left.heightCm - right.heightCm;
  }

  if (column === "weight") {
    return left.weightKg - right.weightKg;
  }

  if (column === "overall") {
    return left.overallRating - right.overallRating;
  }

  if (column === "fee") {
    return left.draftFee - right.draftFee;
  }

  if (column === "wage") {
    return left.wage - right.wage;
  }

  return 0;
};

export const getDefaultDraftCatalogSortDirection = (
  column: DraftCatalogSortColumn,
): DraftCatalogSortDirection => {
  if (
    column === "player"
    || column === "nationality"
    || column === "position"
    || column === "foot"
  ) {
    return "asc";
  }

  return "desc";
};

export const toggleDraftCatalogSort = (
  current: DraftCatalogSort,
  column: DraftCatalogSortColumn,
): DraftCatalogSort => {
  if (current.column === column) {
    if (current.direction === "asc") {
      return {
        column,
        direction: "desc",
      };
    }

    return {
      column,
      direction: "asc",
    };
  }

  return {
    column,
    direction: getDefaultDraftCatalogSortDirection(column),
  };
};

export const sortDraftCatalog = (
  catalog: DraftCatalogPlayer[],
  sort: DraftCatalogSort,
): DraftCatalogPlayer[] => {
  let direction = -1;

  if (sort.direction === "asc") {
    direction = 1;
  }

  return [...catalog].sort((left, right) => {
    const comparison = compareDraftCatalogColumn(left, right, sort.column);

    if (comparison !== 0) {
      return comparison * direction;
    }

    const nameComparison = compareDraftCatalogNames(left, right);

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return left.id.localeCompare(right.id);
  });
};

export const filterDraftCatalog = (
  catalog: DraftCatalogPlayer[],
  positionFilter: SquadPositionFilter,
  tierFilter: DraftTierFilter,
): DraftCatalogPlayer[] => {
  return catalog.filter((player) => {
    if (positionFilter !== "ALL") {
      if (getPositionFilterForPlayer(player.position) !== positionFilter) {
        return false;
      }
    }

    if (tierFilter !== "ALL" && player.draftTier !== tierFilter) {
      return false;
    }

    return true;
  });
};

export const getQuotaForPosition = (
  quotas: DraftQuota[],
  position: PlayerPosition,
): DraftQuota | undefined => {
  return quotas.find((quota) => quota.position === position);
};

export const getPickBlockReason = (
  player: DraftCatalogPlayer,
  draft: ClubDraftState,
): string | undefined => {
  if (player.isPickedByMe) {
    return undefined;
  }

  const quota = getQuotaForPosition(draft.quotas, player.position);

  if (quota && quota.remaining <= 0) {
    return "Position quota is full.";
  }

  if (player.draftFee > draft.remainingCash) {
    return "Not enough remaining cash for this fee.";
  }

  if (player.wage > draft.remainingWageBudget) {
    return "Not enough remaining wage budget.";
  }

  return undefined;
};

export const getSelectedPickCount = (draft: ClubDraftState): number => {
  return draft.picks.length;
};

export const getRequiredPickCount = (draft: ClubDraftState): number => {
  return draft.quotas.reduce((total, quota) => total + quota.required, 0);
};
