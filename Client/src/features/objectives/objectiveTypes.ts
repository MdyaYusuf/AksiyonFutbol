export const ObjectiveKey = {
  WinMatches5: 1,
  ScoreGoals10: 2,
  CleanSheets3: 3,
  IntegrityActions3: 4,
  GrayActions3: 5,
  ReachHonorablePower: 6,
  ReachGrayTierII: 7,
  FacilityUpgrade1: 8,
  SeasonHonorablePackage: 9,
  SeasonShadyPackage: 10,
} as const;

export type ObjectiveKey = (typeof ObjectiveKey)[keyof typeof ObjectiveKey];

export const ObjectiveCategory = {
  Match: 1,
  Actions: 2,
  Identity: 3,
  Club: 4,
} as const;

export type ObjectiveCategory =
  (typeof ObjectiveCategory)[keyof typeof ObjectiveCategory];

export const ObjectiveTrackAffinity = {
  Any: 1,
  Honorable: 2,
  Shady: 3,
} as const;

export type ObjectiveTrackAffinity =
  (typeof ObjectiveTrackAffinity)[keyof typeof ObjectiveTrackAffinity];

export const ObjectiveStatus = {
  Active: 1,
  Completed: 2,
  Claimed: 3,
} as const;

export type ObjectiveStatus =
  (typeof ObjectiveStatus)[keyof typeof ObjectiveStatus];

export const TitleUnlockSource = {
  Season: 1,
  Objective: 2,
  Tutorial: 3,
  Starting: 4,
} as const;

export type TitleUnlockSource =
  (typeof TitleUnlockSource)[keyof typeof TitleUnlockSource];

export interface ObjectiveReward {
  cashReward: number;
  legitimacyReward: number;
  infamyReward: number;
  titleKey?: string | null;
  titleDisplayName?: string | null;
}

export interface ObjectiveProgress {
  key: ObjectiveKey;
  displayName: string;
  description: string;
  category: ObjectiveCategory;
  trackAffinity: ObjectiveTrackAffinity;
  currentValue: number;
  targetValue: number;
  status: ObjectiveStatus;
  reward: ObjectiveReward;
  completedDate?: string | null;
  claimedDate?: string | null;
}

export interface PresidentTitle {
  titleKey: string;
  displayName: string;
  source: TitleUnlockSource;
  unlockedDate: string;
  isEquipped: boolean;
}

export interface ObjectivesContext {
  clubId: string;
  equippedTitle: string;
  claimableCount: number;
  objectives: ObjectiveProgress[];
  titles: PresidentTitle[];
}

export interface ClaimObjectiveRequest {
  objectiveKey: ObjectiveKey;
}

export interface EquipTitleRequest {
  titleKey: string;
}

export interface ClaimObjectiveResult {
  objective: ObjectiveProgress;
  newCash: number;
  newLegitimacy: number;
  newInfamy: number;
  equippedTitle: string;
  titles: PresidentTitle[];
}
