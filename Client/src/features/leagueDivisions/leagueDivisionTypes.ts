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
