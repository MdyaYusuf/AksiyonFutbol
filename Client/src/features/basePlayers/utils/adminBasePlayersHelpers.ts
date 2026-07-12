import {
  PlayerPosition,
  PreferredFoot,
  type BasePlayerResponse,
} from "../basePlayerTypes";

export type BasePlayerPositionFilter = "ALL" | PlayerPosition;

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
