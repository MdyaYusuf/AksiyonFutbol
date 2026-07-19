export const PlayerPosition = {
  Goalkeeper: 1,
  Defender: 2,
  Midfielder: 3,
  Forward: 4,
} as const;

export type PlayerPosition = (typeof PlayerPosition)[keyof typeof PlayerPosition];

export const PreferredFoot = {
  Right: 1,
  Left: 2,
  Both: 3,
} as const;

export type PreferredFoot = (typeof PreferredFoot)[keyof typeof PreferredFoot];

// Responses
export interface BasePlayerResponse {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  overallRating: number;
  createdDate: string;
}

export interface BasePlayerPreview {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  overallRating: number;
}

export interface CreatedBasePlayerResponse {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
}

// Requests
export interface CreateBasePlayerRequest {
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
}

export interface UpdateBasePlayerRequest {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
}
