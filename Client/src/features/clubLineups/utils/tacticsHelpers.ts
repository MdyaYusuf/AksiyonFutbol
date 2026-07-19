import { PlayerPosition } from "../../basePlayers/basePlayerTypes";
import type { PlayerInstanceResponse } from "../../playerInstances/playerInstanceTypes";
import {
  TeamFormation,
  TeamMentality,
  type ClubLineupResponse,
} from "../clubLineupTypes";

export interface FormationShape {
  goalkeepers: number;
  defenders: number;
  midfielders: number;
  forwards: number;
}

export const FORMATION_OPTIONS: { value: TeamFormation; label: string }[] = [
  { value: TeamFormation.FourThreeThree, label: "4-3-3" },
  { value: TeamFormation.FourFourTwo, label: "4-4-2" },
  { value: TeamFormation.ThreeFiveTwo, label: "3-5-2" },
  { value: TeamFormation.FourTwoThreeOne, label: "4-2-3-1" },
];

export const MENTALITY_OPTIONS: { value: TeamMentality; label: string }[] = [
  { value: TeamMentality.Balanced, label: "Balanced" },
  { value: TeamMentality.Attacking, label: "Attacking" },
  { value: TeamMentality.Defensive, label: "Defensive" },
];

export const LINEUP_STARTER_COUNT = 11;
export const LINEUP_MAX_BENCH = 7;

export const getFormationShape = (formation: TeamFormation): FormationShape => {
  switch (formation) {
    case TeamFormation.FourFourTwo:
      return { goalkeepers: 1, defenders: 4, midfielders: 4, forwards: 2 };
    case TeamFormation.ThreeFiveTwo:
      return { goalkeepers: 1, defenders: 3, midfielders: 5, forwards: 2 };
    case TeamFormation.FourTwoThreeOne:
      return { goalkeepers: 1, defenders: 4, midfielders: 5, forwards: 1 };
    default:
      return { goalkeepers: 1, defenders: 4, midfielders: 3, forwards: 3 };
  }
};

export const formatShortName = (firstName: string, lastName: string): string => {
  const initial = firstName.trim().charAt(0);
  const last = lastName.trim();

  if (!initial) {
    return last || "—";
  }

  if (last.length > 10) {
    return `${initial}. ${last.slice(0, 9)}…`;
  }

  return `${initial}. ${last}`;
};

export const getPitchAccentClass = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "border-primary text-primary";
  }
  if (position === PlayerPosition.Midfielder) {
    return "border-secondary text-secondary";
  }
  if (position === PlayerPosition.Goalkeeper) {
    return "border-tertiary text-tertiary";
  }
  return "border-surface-tint text-surface-tint";
};

export const getPitchRatingTextClass = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "text-primary";
  }
  if (position === PlayerPosition.Midfielder) {
    return "text-secondary";
  }
  if (position === PlayerPosition.Goalkeeper) {
    return "text-tertiary";
  }
  return "text-surface-tint";
};

export const getPitchHoverClass = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "group-hover:bg-primary-container group-hover:text-on-primary-container";
  }
  if (position === PlayerPosition.Midfielder) {
    return "group-hover:bg-secondary group-hover:text-on-secondary";
  }
  if (position === PlayerPosition.Goalkeeper) {
    return "group-hover:bg-tertiary group-hover:text-on-tertiary";
  }
  return "group-hover:bg-surface-tint group-hover:text-on-primary";
};

export const groupPlayersByPosition = (players: PlayerInstanceResponse[]) => {
  const forwards = players.filter((p) => p.position === PlayerPosition.Forward);
  const midfielders = players.filter((p) => p.position === PlayerPosition.Midfielder);
  const defenders = players.filter((p) => p.position === PlayerPosition.Defender);
  const goalkeepers = players.filter((p) => p.position === PlayerPosition.Goalkeeper);

  return { forwards, midfielders, defenders, goalkeepers };
};

/** Maps flat starter slots (GK → DEF → MID → FWD) onto pitch rows top→bottom. */
export const buildPitchRows = (
  formation: TeamFormation,
): { label: string; slotIndexes: number[] }[] => {
  const shape = getFormationShape(formation);
  let cursor = 0;

  const take = (count: number) => {
    const indexes = Array.from({ length: count }, (_, i) => cursor + i);
    cursor += count;
    return indexes;
  };

  const gk = take(shape.goalkeepers);
  const def = take(shape.defenders);
  const mid = take(shape.midfielders);
  const fwd = take(shape.forwards);

  return [
    { label: "FWD", slotIndexes: fwd },
    { label: "MID", slotIndexes: mid },
    { label: "DEF", slotIndexes: def },
    { label: "GK", slotIndexes: gk },
  ];
};

export const createEmptyStarterSlots = (): (string | null)[] =>
  Array.from({ length: LINEUP_STARTER_COUNT }, () => null);

export const createEmptyBenchSlots = (): (string | null)[] =>
  Array.from({ length: LINEUP_MAX_BENCH }, () => null);

export const getFormationLabel = (formation: TeamFormation): string => {
  return FORMATION_OPTIONS.find((option) => option.value === formation)?.label ?? "—";
};

export const redistributeByFormation = (
  playerIds: string[],
  formation: TeamFormation,
  playersById: Map<string, PlayerInstanceResponse>,
): (string | null)[] => {
  const shape = getFormationShape(formation);
  const remaining = [...playerIds];
  const result = createEmptyStarterSlots();
  let cursor = 0;

  const take = (position: PlayerPosition, count: number) => {
    for (let i = 0; i < count; i++) {
      const foundIndex = remaining.findIndex((id) => {
        const player = playersById.get(id);
        return player?.position === position;
      });

      if (foundIndex >= 0) {
        result[cursor] = remaining[foundIndex] ?? null;
        remaining.splice(foundIndex, 1);
      } else {
        result[cursor] = null;
      }
      cursor += 1;
    }
  };

  take(PlayerPosition.Goalkeeper, shape.goalkeepers);
  take(PlayerPosition.Defender, shape.defenders);
  take(PlayerPosition.Midfielder, shape.midfielders);
  take(PlayerPosition.Forward, shape.forwards);

  for (let i = 0; i < result.length && remaining.length > 0; i++) {
    if (result[i] == null) {
      result[i] = remaining.shift() ?? null;
    }
  }

  return result;
};

export const lineupToSlots = (
  lineup: ClubLineupResponse,
  playersById: Map<string, PlayerInstanceResponse>,
): { starters: (string | null)[]; bench: (string | null)[] } => {
  const starterIds = [...lineup.starters]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.playerInstanceId);

  const benchIds = [...lineup.bench]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((s) => s.playerInstanceId);

  const starters = redistributeByFormation(starterIds, lineup.formation, playersById);
  const bench = createEmptyBenchSlots();
  benchIds.slice(0, LINEUP_MAX_BENCH).forEach((id, index) => {
    bench[index] = id;
  });

  return { starters, bench };
};
