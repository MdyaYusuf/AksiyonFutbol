import type { LeagueTier } from "@/features/clubs/clubTypes";

export interface CompetitiveSeatingQueueTier {
  tier: LeagueTier;
  clubCount: number;
}

export interface CompetitiveSeatingQueuePreview {
  totalQueuedClubs: number;
  byTier: CompetitiveSeatingQueueTier[];
}

export interface CompetitiveSeatingRunResult {
  divisionsCreated: number;
  clubsSeated: number;
}
