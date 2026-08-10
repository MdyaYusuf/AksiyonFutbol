export const BribeAttemptOutcome = {
  Succeeded: 1,
  Failed: 2,
} as const;

export type BribeAttemptOutcome =
  (typeof BribeAttemptOutcome)[keyof typeof BribeAttemptOutcome];

export type BribeStakeTier = "low" | "medium" | "high";

export interface BriberyContext {
  clubId: string;
  clubName: string;
  clubCash: number;
  canAttempt: boolean;
  unavailableReason?: string | null;
  matchId?: string | null;
  matchWeek?: number | null;
  matchDate?: string | null;
  homeClubId?: string | null;
  homeClubName?: string | null;
  awayClubId?: string | null;
  awayClubName?: string | null;
  isHome?: boolean | null;
  refereeId?: number | null;
  refereeName?: string | null;
  briberyDifficulty?: number | null;
  refereePersonality?: string | null;
  alreadyAttempted: boolean;
  existingOutcome?: BribeAttemptOutcome | null;
  estimatedSuccessChance: number;
  minAmount: number;
  maxAmount: number;
}

export interface BribeAttemptResponse {
  id: string;
  clubId: string;
  clubName: string;
  matchId: string;
  matchWeek: number;
  homeClubName: string;
  awayClubName: string;
  refereeId: number;
  refereeName: string;
  briberyDifficulty: number;
  amount: number;
  successChance: number;
  outcome: BribeAttemptOutcome;
  createdDate: string;
}

export interface CreateBribeAttemptRequest {
  matchId?: string | null;
  amount: number;
}

export interface BribeStakeOption {
  tier: BribeStakeTier;
  title: string;
  description: string;
  amount: number;
  successChance: number;
  detectionChance: number;
}

/** Location state passed from Match Influence → Confirm Bribe. */
export interface MatchInfluenceConfirmState {
  matchId: string;
  amount: number;
  tier: BribeStakeTier;
  title: string;
  successChance: number;
  detectionChance: number;
  refereeName: string;
  refereePersonality: string;
  matchWeek: number;
  homeClubName: string;
  awayClubName: string;
}
