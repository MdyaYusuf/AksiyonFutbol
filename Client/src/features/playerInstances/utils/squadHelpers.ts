import { PlayerPosition, PreferredFoot } from "../../basePlayers/basePlayerTypes";
import type { PlayerInstanceResponse } from "../playerInstanceTypes";

export type SquadPositionFilter = "ALL" | "GK" | "DEF" | "MID" | "FWD";

export const POSITION_FILTERS: SquadPositionFilter[] = [
  "ALL",
  "GK",
  "DEF",
  "MID",
  "FWD",
];

export const getPositionLabel = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Goalkeeper) {
    return "GK";
  }

  if (position === PlayerPosition.Defender) {
    return "DEF";
  }

  if (position === PlayerPosition.Midfielder) {
    return "MID";
  }

  return "FWD";
};

export const getPositionFilterForPlayer = (
  position: PlayerPosition,
): Exclude<SquadPositionFilter, "ALL"> => {
  return getPositionLabel(position) as Exclude<SquadPositionFilter, "ALL">;
};

export const getPositionBadgeClassName = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (position === PlayerPosition.Midfielder) {
    return "bg-tertiary-container text-on-tertiary-container";
  }

  if (position === PlayerPosition.Defender) {
    return "bg-sky-700 text-sky-100";
  }

  return "bg-primary-container text-on-primary-container";
};

export const getDetailPositionBadgeClassName = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "bg-secondary-container text-on-secondary-container";
  }

  if (position === PlayerPosition.Midfielder) {
    return "bg-tertiary-container text-on-tertiary-container";
  }

  if (position === PlayerPosition.Defender) {
    return "bg-sky-700 text-sky-100";
  }

  return "bg-primary-container text-on-primary-container";
};

export const getOverallBadgeClassName = (overallRating: number): string => {
  if (overallRating >= 85) {
    return "bg-primary-container text-on-primary-container";
  }

  return "bg-surface-variant text-on-surface";
};

export const getPlayerDisplayName = (
  firstName: string,
  lastName: string,
): string => {
  const initial = firstName.trim().charAt(0).toUpperCase();
  return initial ? `${initial}. ${lastName}` : lastName;
};

export const getPlayerFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const getPlayerInitials = (
  firstName: string,
  lastName: string,
): string => {
  const first = firstName.trim().charAt(0).toUpperCase();
  const last = lastName.trim().charAt(0).toUpperCase();
  return `${first}${last}` || "?";
};

export const getPreferredFootLabel = (foot: PreferredFoot): string => {
  if (foot === PreferredFoot.Left) {
    return "Left Foot";
  }

  if (foot === PreferredFoot.Both) {
    return "Both Feet";
  }

  return "Right Foot";
};

export const getPlayerStatus = (
  player: PlayerInstanceResponse,
): { label: string; icon: string; className: string } => {
  if (player.isInjured) {
    const weeks = Math.max(1, Math.ceil(player.injuryDays / 7));
    return {
      label: `${weeks}wks`,
      icon: "local_hospital",
      className: "bg-error-container/20 text-error border border-error/30",
    };
  }

  return {
    label: "Fit",
    icon: "check_circle",
    className: "bg-primary-container/20 text-primary border border-primary/30",
  };
};

export const getSeasonCardsTotal = (player: PlayerInstanceResponse): number => {
  return player.seasonYellowCards + player.seasonRedCards;
};

export const formatSquadMoney = (amount: number): string => {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(amount % 1_000 === 0 ? 0 : 0)}k`;
  }

  return `$${amount.toLocaleString("en-US")}`;
};

export const formatWeeklyWage = (amount: number): string => {
  return `${formatSquadMoney(amount)}/pw`;
};

export const filterSquadPlayers = (
  players: PlayerInstanceResponse[],
  positionFilter: SquadPositionFilter,
  searchQuery: string,
): PlayerInstanceResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return players
    .filter((player) => {
      if (positionFilter !== "ALL") {
        if (getPositionFilterForPlayer(player.position) !== positionFilter) {
          return false;
        }
      }

      if (!normalizedQuery) {
        return true;
      }

      const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
      return fullName.includes(normalizedQuery);
    })
    .sort((left, right) => {
      if (right.overallRating !== left.overallRating) {
        return right.overallRating - left.overallRating;
      }

      return left.lastName.localeCompare(right.lastName);
    });
};

export const paginatePlayers = <T>(
  items: T[],
  currentPage: number,
  pageSize: number,
): T[] => {
  const startIndex = (currentPage - 1) * pageSize;
  return items.slice(startIndex, startIndex + pageSize);
};
