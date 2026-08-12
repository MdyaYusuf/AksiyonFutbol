import type {
  PlayerAttributes,
  PlayerPosition,
  PreferredFoot,
} from "../basePlayers/basePlayerTypes";

export type { PlayerAttributes } from "../basePlayers/basePlayerTypes";

// Responses
export interface PlayerInstanceResponse {
  id: string;
  firstName: string;
  lastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  attackPower: number;
  defenseStrength: number;
  midfieldControl: number;
  overallRating: number;
  isInjured: boolean;
  injuryDays: number;
  seasonGoals: number;
  seasonAssists: number;
  seasonYellowCards: number;
  seasonRedCards: number;
  marketValue: number;
  wage: number;
  clubId: string;
  clubName: string;
  basePlayerId?: string | null;
  createdDate: string;
}

export interface PlayerInstancePreview {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  age: number;
  overallRating: number;
  isInjured: boolean;
  injuryDays: number;
  clubId: string;
  clubName: string;
}

export interface CreatedPlayerInstanceResponse {
  id: string;
  firstName: string;
  lastName: string;
  position: PlayerPosition;
  clubId: string;
}

// Requests
export interface CreatePlayerInstanceFromBasePlayerRequest {
  clubId: string;
  basePlayerId: string;
  marketValue: number;
  wage: number;
}

export interface CreateCustomPlayerInstanceRequest {
  clubId: string;
  firstName: string;
  lastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  marketValue: number;
  wage: number;
}

export interface UpdatePlayerInstanceNameRequest {
  id: string;
  firstName: string;
  lastName: string;
}

export interface UpdatePlayerInstanceStatsRequest {
  id: string;
  position: PlayerPosition;
  age: number;
  heightCm: number;
  weightKg: number;
  preferredFoot: PreferredFoot;
  attributes: PlayerAttributes;
  marketValue: number;
  wage: number;
}

export interface UpdatePlayerInstanceHealthRequest {
  id: string;
  isInjured: boolean;
  injuryDays: number;
}

export interface UpdatePlayerInstanceSeasonStatsRequest {
  id: string;
  seasonGoals: number;
  seasonAssists: number;
  seasonYellowCards: number;
  seasonRedCards: number;
}
