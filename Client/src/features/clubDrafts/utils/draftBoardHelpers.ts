import { DraftTier, PlayerPosition } from "../../basePlayers/basePlayerTypes";
import {
  getPositionFilterForPlayer,
  type SquadPositionFilter,
} from "../../playerInstances/utils/squadHelpers";
import type {
  ClubDraftState,
  DraftCatalogPlayer,
  DraftQuota,
} from "../clubDraftTypes";

export type DraftTierFilter = DraftTier | "ALL";

export const DRAFT_TIER_FILTERS: { value: DraftTierFilter; label: string }[] = [
  { value: "ALL", label: "All Tiers" },
  { value: DraftTier.Gold, label: "Gold" },
  { value: DraftTier.Silver, label: "Silver" },
  { value: DraftTier.Bronze, label: "Bronze" },
  { value: DraftTier.Iron, label: "Iron" },
];

export const filterDraftCatalog = (
  catalog: DraftCatalogPlayer[],
  positionFilter: SquadPositionFilter,
  tierFilter: DraftTierFilter,
  searchQuery: string,
): DraftCatalogPlayer[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return catalog
    .filter((player) => {
      if (positionFilter !== "ALL") {
        if (getPositionFilterForPlayer(player.position) !== positionFilter) {
          return false;
        }
      }

      if (tierFilter !== "ALL" && player.draftTier !== tierFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const fullName =
        `${player.defaultFirstName} ${player.defaultLastName}`.toLowerCase();
      return fullName.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (right.overallRating !== left.overallRating) {
        return right.overallRating - left.overallRating;
      }

      return left.defaultLastName.localeCompare(right.defaultLastName);
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

  if (player.estimatedWage > draft.remainingWageBudget) {
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
