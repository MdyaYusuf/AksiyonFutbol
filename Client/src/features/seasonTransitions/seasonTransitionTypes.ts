export const SeasonMovementOutcome = {
  Promoted: 1,
  Relegated: 2,
  Stayed: 3,
} as const;

export type SeasonMovementOutcome =
  (typeof SeasonMovementOutcome)[keyof typeof SeasonMovementOutcome];

export interface StandingRow {
  position: number;
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface SeasonClubMovement {
  clubId: string;
  clubName: string;
  position: number;
  points: number;
  fromDivisionId: number;
  fromDivisionName: string;
  fromTier: number;
  toDivisionId?: number | null;
  toDivisionName?: string | null;
  toTier?: number | null;
  outcome: SeasonMovementOutcome;
}

export interface SeasonDivisionPreview {
  divisionId: number;
  divisionName: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
  currentSeason: number;
  isSeasonComplete: boolean;
  standings: StandingRow[];
}

export interface SeasonEndPreview {
  groupNumber: number;
  promotionSlots: number;
  relegationSlots: number;
  swapSlots: number;
  canProcess: boolean;
  blockReason?: string | null;
  divisions: SeasonDivisionPreview[];
  movements: SeasonClubMovement[];
}

export interface SeasonEndProcessResult {
  groupNumber: number;
  clubsPromoted: number;
  clubsRelegated: number;
  divisionsReset: number;
  resetMatchWeek: number;
  fixturesGenerated: number;
  movements: SeasonClubMovement[];
}
