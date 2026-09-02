import type {
  SeasonClubMovement,
  SeasonDivisionPreview,
  SeasonEndPreview,
  StandingRow,
} from "@/features/seasonTransitions/seasonTransitionTypes";
import { SeasonMovementOutcome } from "@/features/seasonTransitions/seasonTransitionTypes";

export type CondensedStandingRow =
  | { kind: "standing"; row: StandingRow; zone: "promoted" | "relegated" | "user" | "mid" }
  | { kind: "ellipsis"; key: string };

export const getUserDivisionPreview = (
  preview: SeasonEndPreview,
  clubDivisionId: number,
): SeasonDivisionPreview | undefined => {
  return preview.divisions.find((division) => division.divisionId === clubDivisionId);
};

export const getPromotedMovements = (
  movements: SeasonClubMovement[],
  fromDivisionId: number,
): SeasonClubMovement[] => {
  return movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Promoted &&
      movement.fromDivisionId === fromDivisionId,
  );
};

export const getRelegatedMovements = (
  movements: SeasonClubMovement[],
  fromDivisionId: number,
): SeasonClubMovement[] => {
  return movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Relegated &&
      movement.fromDivisionId === fromDivisionId,
  );
};

/** Movements into this division from below (promotions into current table). */
export const getIncomingPromotions = (
  movements: SeasonClubMovement[],
  toDivisionId: number,
): SeasonClubMovement[] => {
  return movements.filter(
    (movement) =>
      movement.outcome === SeasonMovementOutcome.Promoted &&
      movement.toDivisionId === toDivisionId,
  );
};

/** Clubs leaving this division downward. */
export const getOutgoingRelegations = (
  movements: SeasonClubMovement[],
  fromDivisionId: number,
): SeasonClubMovement[] => {
  return getRelegatedMovements(movements, fromDivisionId);
};

export const buildCondensedStandings = (
  standings: StandingRow[],
  currentClubId: string,
  swapSlots: number,
): CondensedStandingRow[] => {
  if (standings.length === 0) {
    return [];
  }

  const promotedIds = new Set(
    standings.slice(0, Math.min(swapSlots, standings.length)).map((row) => row.clubId),
  );
  const relegatedIds = new Set(
    standings.slice(Math.max(0, standings.length - swapSlots)).map((row) => row.clubId),
  );

  const userIndex = standings.findIndex((row) => row.clubId === currentClubId);
  const includeIndexes = new Set<number>();

  for (let i = 0; i < standings.length; i++) {
    const row = standings[i];
    if (promotedIds.has(row.clubId) || relegatedIds.has(row.clubId) || i === userIndex) {
      includeIndexes.add(i);
    }
  }

  // Keep a bit of mid-table context near the top (first mid row after promotion)
  if (standings.length > swapSlots + 1) {
    includeIndexes.add(swapSlots);
  }

  const sortedIndexes = [...includeIndexes].sort((a, b) => a - b);
  const result: CondensedStandingRow[] = [];
  let previous = -1;

  for (const index of sortedIndexes) {
    if (previous >= 0 && index - previous > 1) {
      result.push({ kind: "ellipsis", key: `gap-${previous}-${index}` });
    }

    const row = standings[index];
    let zone: "promoted" | "relegated" | "user" | "mid" = "mid";

    if (promotedIds.has(row.clubId)) {
      zone = "promoted";
    } else if (relegatedIds.has(row.clubId)) {
      zone = "relegated";
    } else if (row.clubId === currentClubId) {
      zone = "user";
    }

    result.push({ kind: "standing", row, zone });
    previous = index;
  }

  return result;
};

export const formatGoalDifference = (value: number): string => {
  if (value > 0) {
    return `+${value}`;
  }

  return String(value);
};

export const getClubInitial = (name: string): string => {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed[0]!.toUpperCase() : "?";
};

export const getBoardReview = (
  standings: StandingRow[],
  currentClubId: string,
): { objective: string; result: string; achieved: boolean; rating: string } => {
  const userRow = standings.find((row) => row.clubId === currentClubId);
  const total = standings.length;

  if (!userRow || total === 0) {
    return {
      objective: "Complete the season",
      result: "Pending",
      achieved: false,
      rating: "—",
    };
  }

  const position = userRow.position;
  const topThird = Math.ceil(total / 3);
  const bottomThird = total - Math.floor(total / 3) + 1;

  if (position === 1) {
    return {
      objective: "Title challenge",
      result: "Champions",
      achieved: true,
      rating: "A+",
    };
  }

  if (position <= 2) {
    return {
      objective: "Promotion push",
      result: "Promoted",
      achieved: true,
      rating: "A",
    };
  }

  if (position <= topThird) {
    return {
      objective: "Top-half finish",
      result: "Achieved",
      achieved: true,
      rating: "B+",
    };
  }

  if (position >= bottomThird) {
    return {
      objective: "Avoid relegation",
      result: position > total - 2 ? "Relegated" : "Survived",
      achieved: position <= total - 2,
      rating: position > total - 2 ? "D" : "C+",
    };
  }

  return {
    objective: "Mid-table finish",
    result: "Achieved",
    achieved: true,
    rating: "B",
  };
};
