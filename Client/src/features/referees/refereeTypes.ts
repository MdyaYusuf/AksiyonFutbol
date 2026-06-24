export enum RefereePersonalityType {
  Strict = 1,
  Lenient = 2,
  Balanced = 3,
  Corruptible = 4,
  Showman = 5,
}

// Responses
export interface RefereeResponse {
  id: number;
  name: string;
  briberyDifficulty: number;
  personalityType: RefereePersonalityType;
  biography?: string | null;
  createdDate: string;
}

export interface RefereePreview {
  id: number;
  name: string;
  briberyDifficulty: number;
  personalityType: RefereePersonalityType;
}

export interface CreatedRefereeResponse {
  id: number;
  name: string;
  personalityType: RefereePersonalityType;
}

// Requests
export interface CreateRefereeRequest {
  name: string;
  briberyDifficulty: number;
  personalityType: RefereePersonalityType;
  biography?: string | null;
}

export interface UpdateRefereeRequest {
  id: number;
  name: string;
  briberyDifficulty: number;
  personalityType: RefereePersonalityType;
  biography?: string | null;
}
