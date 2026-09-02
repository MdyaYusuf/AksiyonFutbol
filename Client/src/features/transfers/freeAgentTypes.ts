import type { DraftTier, PlayerPosition, PreferredFoot } from "@/features/basePlayers/basePlayerTypes";

export interface FreeAgentMarketItem {
  basePlayerId: string;
  firstName: string;
  lastName: string;
  nationality?: string | null;
  position: string;
  preferredFoot: PreferredFoot;
  age: number;
  heightCm: number;
  weightKg: number;
  overallRating: number;
  draftTier: DraftTier;
  signingFee: number;
  wage: number;
  marketValue: number;
}

export interface FreeAgentMarketQuery {
  position?: PlayerPosition;
  tier?: DraftTier;
  search?: string;
  sortBy?: string;
  sortDescending?: boolean;
  currentPage?: number;
  pageSize?: number;
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
