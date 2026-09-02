import { PlayerPosition } from "@/features/basePlayers/basePlayerTypes";
import type { PlayerInstanceResponse } from "@/features/playerInstances/playerInstanceTypes";

export type PlayerStatusFilter = "all" | "available" | "injured";
export type PlayerPositionFilter = "all" | PlayerPosition;

export const filterAdminPlayerInstances = (
  players: PlayerInstanceResponse[],
  searchQuery: string,
  clubId: string | "all",
  positionFilter: PlayerPositionFilter,
  statusFilter: PlayerStatusFilter,
): PlayerInstanceResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return players.filter((player) => {
    if (clubId !== "all" && player.clubId !== clubId) {
      return false;
    }

    if (positionFilter !== "all" && player.position !== positionFilter) {
      return false;
    }

    if (statusFilter === "available" && player.isInjured) {
      return false;
    }

    if (statusFilter === "injured" && !player.isInjured) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const clubName = player.clubName.toLowerCase();

    return fullName.includes(normalizedQuery) || clubName.includes(normalizedQuery);
  });
};

export const getInjuryStatusLabel = (player: PlayerInstanceResponse): string => {
  if (!player.isInjured) {
    return "Available";
  }

  const days = Math.max(0, player.injuryDays);
  return `Injured (${days}d)`;
};
