import type { DraftTier, PlayerPosition } from "../basePlayers/basePlayerTypes";

export interface FreeAgentMarketItem {
  basePlayerId: string;
  firstName: string;
  lastName: string;
  position: string;
  age: number;
  overallRating: number;
  draftTier: DraftTier;
  signingFee: number;
  estimatedWage: number;
  estimatedMarketValue: number;
}

export interface FreeAgentMarketQuery {
  position?: PlayerPosition;
  tier?: DraftTier;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface SignFreeAgentResponse {
  playerInstanceId: string;
  basePlayerId: string;
  firstName: string;
  lastName: string;
  position: string;
  overallRating: number;
  signingFeePaid: number;
  wage: number;
  remainingCash: number;
}

export type TransferMarketTab = "listings" | "free-agents";
