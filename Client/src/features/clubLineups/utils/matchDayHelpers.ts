import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import { getPositionLabel } from "../../playerInstances/utils/squadHelpers";

export const getPlayerFitnessPercent = (player: PlayerInstanceResponse): number => {
  if (player.isInjured) {
    return Math.max(12, 28 - Math.min(player.injuryDays, 16));
  }

  return Math.min(98, 82 + Math.floor(player.overallRating / 10));
};

export const getPositionRoleLabel = (position: PlayerPosition): string => {
  const short = getPositionLabel(position);

  if (position === PlayerPosition.Goalkeeper) {
    return `${short} • Goalkeeper`;
  }

  if (position === PlayerPosition.Defender) {
    return `${short} • Defender`;
  }

  if (position === PlayerPosition.Midfielder) {
    return `${short} • Midfielder`;
  }

  return `${short} • Forward`;
};

export const formatPitchSurname = (firstName: string, lastName: string): string => {
  const last = lastName.trim().toUpperCase();
  const initial = firstName.trim().charAt(0).toUpperCase();

  if (!last) {
    return initial || "—";
  }

  const truncated = last.length > 10 ? `${last.slice(0, 9)}…` : last;

  if (initial) {
    return `${initial}. ${truncated}`;
  }

  return truncated;
};
