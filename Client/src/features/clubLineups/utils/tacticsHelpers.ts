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
    return "border-secondary text-secondary";
  }

  if (position === PlayerPosition.Midfielder) {
    return "border-tertiary text-tertiary";
  }

  if (position === PlayerPosition.Defender) {
    return "border-sky-400 text-sky-300";
  }

  return "border-teal-400 text-teal-300";
};

export const getPitchRatingTextClass = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "text-secondary";
  }

  if (position === PlayerPosition.Midfielder) {
    return "text-tertiary";
  }

  if (position === PlayerPosition.Defender) {
    return "text-sky-300";
  }

  return "text-teal-300";
};

export const getPitchHoverClass = (position: PlayerPosition): string => {
  if (position === PlayerPosition.Forward) {
    return "group-hover:bg-secondary group-hover:text-on-secondary";
  }

  if (position === PlayerPosition.Midfielder) {
    return "group-hover:bg-tertiary-container group-hover:text-on-tertiary-container";
  }

  if (position === PlayerPosition.Defender) {
    return "group-hover:bg-sky-700 group-hover:text-sky-100";
  }

  return "group-hover:bg-teal-700 group-hover:text-teal-100";
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

  // 4-2-3-1: ST, then AML-AMC-AMR, then twin DMCs, then back four.
  if (formation === TeamFormation.FourTwoThreeOne && mid.length === 5) {
    const dmc = mid.slice(0, 2);
    const amLine = mid.slice(2, 5);

    return [
      { label: "FWD", slotIndexes: fwd },
      { label: "AM", slotIndexes: amLine },
      { label: "DMC", slotIndexes: dmc },
      { label: "DEF", slotIndexes: def },
      { label: "GK", slotIndexes: gk },
    ];
  }

  return [
    { label: "FWD", slotIndexes: fwd },
    { label: "MID", slotIndexes: mid },
    { label: "DEF", slotIndexes: def },
    { label: "GK", slotIndexes: gk },
  ];
};

export const getStarterSlotPosition = (
  formation: TeamFormation,
  slotIndex: number,
): PlayerPosition => {
  const rows = buildPitchRows(formation);

  for (const row of rows) {
    if (!row.slotIndexes.includes(slotIndex)) {
      continue;
    }

    if (row.label === "GK") {
      return PlayerPosition.Goalkeeper;
    }

    if (row.label === "DEF") {
      return PlayerPosition.Defender;
    }

    if (row.label === "FWD") {
      return PlayerPosition.Forward;
    }

    return PlayerPosition.Midfielder;
  }

  return PlayerPosition.Midfielder;
};

export type LineupDragKind = "starter" | "bench";

export interface LineupDragPayload {
  kind: LineupDragKind;
  index: number;
  playerId: string;
}

const LINEUP_DRAG_PREFIX = "aksiyon-lineup:";

export const serializeLineupDrag = (payload: LineupDragPayload): string => {
  return `${LINEUP_DRAG_PREFIX}${JSON.stringify(payload)}`;
};

export const parseLineupDrag = (raw: string): LineupDragPayload | null => {
  if (!raw.startsWith(LINEUP_DRAG_PREFIX)) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw.slice(LINEUP_DRAG_PREFIX.length)) as LineupDragPayload;
    if (
      (parsed.kind !== "starter" && parsed.kind !== "bench") ||
      typeof parsed.index !== "number" ||
      typeof parsed.playerId !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export type SlotCandidateSource = "bench" | "unused" | "starter";

export interface SlotCandidate {
  player: PlayerInstanceResponse;
  source: SlotCandidateSource;
  starterIndex?: number;
  benchIndex?: number;
}

export const getSlotCandidates = (
  formation: TeamFormation,
  slotIndex: number,
  starterIds: (string | null)[],
  benchIds: (string | null)[],
  squad: PlayerInstanceResponse[],
): SlotCandidate[] => {
  const required = getStarterSlotPosition(formation, slotIndex);
  const occupantId = starterIds[slotIndex];
  const candidates: SlotCandidate[] = [];

  squad.forEach((player) => {
    if (player.position !== required) {
      return;
    }

    if (player.id === occupantId) {
      return;
    }

    const starterIndex = starterIds.findIndex((id) => id === player.id);
    if (starterIndex >= 0) {
      candidates.push({ player, source: "starter", starterIndex });
      return;
    }

    const benchIndex = benchIds.findIndex((id) => id === player.id);
    if (benchIndex >= 0) {
      candidates.push({ player, source: "bench", benchIndex });
      return;
    }

    candidates.push({ player, source: "unused" });
  });

  const sourceRank = (source: SlotCandidateSource) => {
    if (source === "bench") {
      return 0;
    }

    if (source === "unused") {
      return 1;
    }

    return 2;
  };

  return candidates.sort((a, b) => {
    const bySource = sourceRank(a.source) - sourceRank(b.source);
    if (bySource !== 0) {
      return bySource;
    }

    return b.player.overallRating - a.player.overallRating;
  });
};

export const getBenchCandidates = (
  benchIndex: number,
  starterIds: (string | null)[],
  benchIds: (string | null)[],
  squad: PlayerInstanceResponse[],
): SlotCandidate[] => {
  const occupantId = benchIds[benchIndex];
  const assignedIds = new Set<string>();

  starterIds.forEach((id) => {
    if (id) {
      assignedIds.add(id);
    }
  });

  benchIds.forEach((id, index) => {
    if (id && index !== benchIndex) {
      assignedIds.add(id);
    }
  });

  return squad
    .filter((player) => {
      if (player.id === occupantId) {
        return false;
      }

      return !assignedIds.has(player.id);
    })
    .sort((a, b) => b.overallRating - a.overallRating)
    .map((player) => ({ player, source: "unused" as const }));
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
