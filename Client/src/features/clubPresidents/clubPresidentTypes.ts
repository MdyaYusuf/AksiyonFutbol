// Responses
export interface ClubPresidentResponse {
  id: string;
  userId: string;
  userName: string;
  name: string;
  reputationPoints: number;
  infamyPoints: number;
  title?: string | null;
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
  createdDate: string;
}

export interface ClubPresidentPreview {
  id: string;
  name: string;
  reputationPoints: number;
  infamyPoints: number;
  title?: string | null;
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
}

export interface CreatedClubPresidentResponse {
  id: string;
  name: string;
  title?: string | null;
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
}

export type PresidentAttributeKey =
  | "charisma"
  | "authority"
  | "integrity"
  | "cunning"
  | "connections";

export interface PresidentAttributes {
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
}

// Requests
export interface CreateClubPresidentRequest {
  name: string;
  title?: string | null;
  charisma: number;
  authority: number;
  integrity: number;
  cunning: number;
  connections: number;
}

export interface UpdateClubPresidentRequest {
  id: string;
  name: string;
  title?: string | null;
}

export interface UpdateClubPresidentReputationRequest {
  id: string;
  reputationPoints: number;
}
