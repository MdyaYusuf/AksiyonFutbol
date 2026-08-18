import {
  DraftTier,
  PlayerPosition,
  PreferredFoot,
  type BasePlayerResponse,
} from "../basePlayerTypes";

export type BasePlayerPositionFilter = "ALL" | PlayerPosition;

export interface DraftTierPricingDefaults {
  draftFee: number;
  wage: number;
  marketValue: number;
}

export const getDraftTierPricingDefaults = (
  draftTier: DraftTier,
  isDraftOnly = false,
): DraftTierPricingDefaults => {
  if (draftTier === DraftTier.Gold) {
    if (isDraftOnly) {
      return { draftFee: 16000, wage: 2050, marketValue: 95000 };
    }

    return { draftFee: 11000, wage: 1700, marketValue: 68000 };
  }

  if (draftTier === DraftTier.Silver) {
    return { draftFee: 5500, wage: 1400, marketValue: 40000 };
  }

  if (draftTier === DraftTier.Iron) {
    return { draftFee: 1000, wage: 850, marketValue: 13000 };
  }

  return { draftFee: 2500, wage: 1150, marketValue: 25000 };
};

export const applyDraftPricingIfUnedited = (
  current: DraftTierPricingDefaults,
  previousDefaults: DraftTierPricingDefaults,
  nextDefaults: DraftTierPricingDefaults,
): DraftTierPricingDefaults => {
  if (
    current.draftFee === previousDefaults.draftFee &&
    current.wage === previousDefaults.wage &&
    current.marketValue === previousDefaults.marketValue
  ) {
    return nextDefaults;
  }

  return {
    draftFee: current.draftFee,
    wage: current.wage,
    marketValue: current.marketValue,
  };
};

export const getPreferredFootLabel = (foot: PreferredFoot): string => {
  if (foot === PreferredFoot.Left) {
    return "Left";
  }

  if (foot === PreferredFoot.Both) {
    return "Both";
  }

  return "Right";
};

export const getAttributeTextClassName = (value: number): string => {
  if (value >= 70) {
    return "text-primary";
  }

  if (value >= 40) {
    return "text-secondary";
  }

  return "text-on-surface-variant";
};

export const getOverallBadgeClassName = (overallRating: number): string => {
  if (overallRating >= 85) {
    return "bg-primary-container text-on-primary-container";
  }

  if (overallRating >= 70) {
    return "bg-primary-fixed-dim text-on-primary-fixed";
  }

  return "bg-surface-variant text-on-surface";
};

export const getBasePlayerDisplayName = (
  firstName: string,
  lastName: string,
): string => {
  return `${firstName} ${lastName}`.trim();
};

export const filterBasePlayers = (
  players: BasePlayerResponse[],
  searchQuery: string,
  positionFilter: BasePlayerPositionFilter,
): BasePlayerResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return players.filter((player) => {
    if (positionFilter !== "ALL" && player.position !== positionFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const fullName =
      `${player.defaultFirstName} ${player.defaultLastName}`.toLowerCase();
    const nationality = player.nationality?.toLowerCase() ?? "";

    return fullName.includes(normalizedQuery) || nationality.includes(normalizedQuery);
  });
};
