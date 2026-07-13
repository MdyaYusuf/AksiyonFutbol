// Responses
export interface LeagueDivisionResponse {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
  createdDate: string;
}

export interface LeagueDivisionPreview {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
}

export interface CreatedLeagueDivisionResponse {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
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
