export const DivisionLifecycleStatus = {
  Active: 1,
  Completed: 2,
  Sealed: 3,
} as const;

export type DivisionLifecycleStatus =
  (typeof DivisionLifecycleStatus)[keyof typeof DivisionLifecycleStatus];

// Responses
export interface LeagueDivisionResponse {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
  currentSeason: number;
  isTutorial: boolean;
  ownerUserId?: string | null;
  lifecycleStatus: DivisionLifecycleStatus;
  createdDate: string;
}

export interface LeagueDivisionPreview {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
  currentSeason: number;
  isTutorial: boolean;
  lifecycleStatus: DivisionLifecycleStatus;
}

export interface CreatedLeagueDivisionResponse {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentSeason: number;
  isTutorial: boolean;
  lifecycleStatus: DivisionLifecycleStatus;
}

export interface ProcessMatchWeekResult {
  divisionId: number;
  processedMatchWeek: number;
  simulatedMatchCount: number;
  currentMatchWeek: number;
  weekAdvanced: boolean;
}

// Requests
export interface CreateLeagueDivisionRequest {
  name: string;
  tier: number;
  groupNumber: number;
}

export interface UpdateLeagueDivisionRequest {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
}

export interface UpdateLeagueDivisionMatchWeekRequest {
  id: number;
  currentMatchWeek: number;
}
