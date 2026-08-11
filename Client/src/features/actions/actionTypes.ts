export const ClubActionCategory = {
  Match: 1,
  Squad: 2,
  Politics: 3,
} as const;

export type ClubActionCategory =
  (typeof ClubActionCategory)[keyof typeof ClubActionCategory];

export const ClubActionType = {
  MatchFixing: 1,
  Doping: 2,
  Espionage: 3,
  Sabotage: 4,
  IntimidateReferee: 5,
  TeamBonding: 20,
  FinePlayer: 21,
  MotivationalTalk: 22,
  BrutalTraining: 23,
  PromiseWinBonus: 24,
  MediaSpin: 40,
  LobbyFederation: 41,
  DodgySponsorship: 42,
  TapUpTarget: 43,
} as const;

export type ClubActionType = (typeof ClubActionType)[keyof typeof ClubActionType];

export const ClubActionOutcome = {
  Succeeded: 1,
  Failed: 2,
} as const;

export type ClubActionOutcome =
  (typeof ClubActionOutcome)[keyof typeof ClubActionOutcome];

export const MediaSpinMode = {
  OpponentMorale: 1,
  ReputationRepair: 2,
} as const;

export type MediaSpinMode = (typeof MediaSpinMode)[keyof typeof MediaSpinMode];

export interface UpcomingMatchSummary {
  matchId: string;
  matchWeek: number;
  matchDate: string;
  homeClubId: string;
  homeClubName: string;
  awayClubId: string;
  awayClubName: string;
  isHome: boolean;
}

export interface ClubActionAvailability {
  actionType: ClubActionType;
  category: ClubActionCategory;
  displayName: string;
  description: string;
  cost: number;
  heatGenerated: number;
  successChance: number;
  detectionChance: number;
  isShady: boolean;
  requiresMatch: boolean;
  isAvailable: boolean;
  unavailableReason?: string | null;
  cooldownDays: number;
  cooldownRemainingDays: number;
}

export interface ClubActionsContext {
  clubId: string;
  clubName: string;
  clubCash: number;
  suspicion: number;
  maxSuspicion: number;
  cashSpendLocked?: boolean;
  upcomingMatch?: UpcomingMatchSummary | null;
  actions: ClubActionAvailability[];
}

export interface ClubActionHistoryItem {
  id: string;
  actionType: ClubActionType;
  category: ClubActionCategory;
  displayName: string;
  matchId?: string | null;
  matchWeek?: number | null;
  targetPlayerInstanceId?: string | null;
  outcome: ClubActionOutcome;
  wasDetected: boolean;
  heatGenerated: number;
  cashSpent: number;
  successChance: number;
  detectionChance: number;
  fineAmount: number;
  scandalMoralePenaltyApplied: number;
  scandalReputationPenaltyApplied: number;
  matchPenaltyApplied: boolean;
  createdDate: string;
}

export interface InvestigationConsequence {
  fineAmount: number;
  moralePenalty: number;
  reputationPenalty: number;
  matchPenaltyApplied: boolean;
}

export interface ClubActionResult {
  action: ClubActionHistoryItem;
  newCash: number;
  newSuspicion: number;
  newMorale: number;
  newChemistry: number;
  newDiscipline: number;
  newReputationPoints?: number | null;
  investigation?: InvestigationConsequence | null;
}

export interface ExecuteClubActionRequest {
  actionType: ClubActionType;
  matchId?: string | null;
  mediaSpinMode?: MediaSpinMode | null;
  targetPlayerInstanceId?: string | null;
}
