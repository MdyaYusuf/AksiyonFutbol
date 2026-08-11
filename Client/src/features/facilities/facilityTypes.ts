export const FacilityType = {
  TrainingGround: 1,
  YouthAcademy: 2,
} as const;

export type FacilityType = (typeof FacilityType)[keyof typeof FacilityType];

export interface ClubFacility {
  id: string;
  clubId: string;
  facilityType: FacilityType;
  facilityTypeName: string;
  level: number;
  maxLevel: number;
  nextUpgradeCost: number;
  canUpgrade: boolean;
  isMaxLevel: boolean;
}

export interface ClubFacilitiesOverview {
  clubId: string;
  clubName: string;
  clubCash: number;
  morale: number;
  chemistry: number;
  discipline: number;
  cashSpendLocked?: boolean;
  facilities: ClubFacility[];
}

export interface UpgradeFacilityRequest {
  facilityType: FacilityType;
}
