import { ClubLifecycleStatus } from "@/features/clubs/clubTypes";
import {
  DraftTier,
  PlayerPosition,
  PreferredFoot,
} from "@/features/basePlayers/basePlayerTypes";

export interface DraftCatalogPlayer {
  id: string;
  defaultFirstName: string;
  defaultLastName: string;
  nationality?: string | null;
  position: PlayerPosition;
  preferredFoot: PreferredFoot;
  age: number;
  heightCm: number;
  weightKg: number;
  overallRating: number;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
  isPickedByMe: boolean;
  isDraftOnly: boolean;
  isFreeAgentTemplate: boolean;
}

export interface DraftPick {
  basePlayerId: string;
  pickOrder: number;
  defaultFirstName: string;
  defaultLastName: string;
  position: PlayerPosition;
  overallRating: number;
  draftTier: DraftTier;
  draftFee: number;
  wage: number;
}

export interface DraftQuota {
  position: PlayerPosition;
  required: number;
  selected: number;
  remaining: number;
}

export interface ClubDraftState {
  clubId: string;
  clubName: string;
  lifecycleStatus: ClubLifecycleStatus;
  cash: number;
  wageBudget: number;
  spentFees: number;
  committedWages: number;
  remainingCash: number;
  remainingWageBudget: number;
  canFinalize: boolean;
  quotas: DraftQuota[];
  picks: DraftPick[];
}

export interface FinalizeClubDraftResponse {
  clubId: string;
  tutorialDivisionId: number;
  tutorialDivisionName: string;
  lifecycleStatus: ClubLifecycleStatus;
  squadSize: number;
  fixturesScheduled: boolean;
}

export interface AddClubDraftPickRequest {
  basePlayerId: string;
}
