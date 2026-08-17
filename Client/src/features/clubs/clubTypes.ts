export const ClubLifecycleStatus = {
  Drafting: 1,
  Tutorial: 2,
  AwaitingPlacement: 3,
  Competitive: 4,
} as const;

export type ClubLifecycleStatus =
  (typeof ClubLifecycleStatus)[keyof typeof ClubLifecycleStatus];

export const LeagueTier = {
  Gold: 1,
  Silver: 2,
  Bronze: 3,
  Iron: 4,
} as const;

export type LeagueTier = (typeof LeagueTier)[keyof typeof LeagueTier];

// Responses
export interface ClubResponse {
  id: string;
  name: string;
  isBot: boolean;
  cash: number;
  wageBudget: number;
  morale: number;
  chemistry: number;
  discipline: number;
  suspicion?: number;
  cashSpendLocked?: boolean;
  lifecycleStatus: ClubLifecycleStatus;
  placementTargetTier?: LeagueTier | null;
  tutorialDivisionId?: number | null;
  presidentId?: string | null;
  presidentName?: string | null;
  divisionId?: number | null;
  divisionName?: string | null;
  divisionTier?: number | null;
  divisionGroupNumber?: number | null;
  divisionCurrentSeason?: number | null;
  createdDate: string;
}

export interface ClubPreview {
  id: string;
  name: string;
  isBot: boolean;
  lifecycleStatus: ClubLifecycleStatus;
  presidentId?: string | null;
  presidentName?: string | null;
  divisionId?: number | null;
  divisionName?: string | null;
}

export interface CreatedClubResponse {
  id: string;
  name: string;
  lifecycleStatus: ClubLifecycleStatus;
  divisionId?: number | null;
}

export interface ClubCreationDefaults {
  startingCash: number;
  startingWageBudget: number;
  startingClubStatus: number;
}

// Requests
export interface CreateClubRequest {
  name: string;
}

export interface CreateBotClubRequest {
  name: string;
  divisionId: number;
  cash: number;
  wageBudget: number;
  morale: number;
  chemistry: number;
  discipline: number;
}

export interface UpdateClubRequest {
  id: string;
  name: string;
}

export interface UpdateClubFinancesRequest {
  id: string;
  cash: number;
  wageBudget: number;
}

export interface UpdateClubStatusRequest {
  id: string;
  morale: number;
  chemistry: number;
  discipline: number;
}
