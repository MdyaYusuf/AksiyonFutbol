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
  cashSpendLocked?: boolean;
  presidentId?: string | null;
  presidentName?: string | null;
  divisionId: number;
  divisionName: string;
  divisionTier: number;
  divisionGroupNumber: number;
  createdDate: string;
}

export interface ClubPreview {
  id: string;
  name: string;
  isBot: boolean;
  presidentId?: string | null;
  presidentName?: string | null;
  divisionId: number;
  divisionName: string;
}

export interface CreatedClubResponse {
  id: string;
  name: string;
  divisionId: number;
}

export interface ClubCreationDefaults {
  startingCash: number;
  startingWageBudget: number;
  startingClubStatus: number;
}

// Requests
export interface CreateClubRequest {
  name: string;
  divisionId: number;
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
