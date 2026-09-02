import type { ClubFacility, FacilityType } from "@/features/facilities/facilityTypes";
import { FacilityType as FacilityTypeValues } from "@/features/facilities/facilityTypes";

export const getFacilityLevelLabel = (level: number, maxLevel: number): string => {
  if (level >= maxLevel) {
    return "World Class";
  }

  if (level >= Math.ceil(maxLevel * 0.75)) {
    return "State of the Art";
  }

  if (level >= Math.ceil(maxLevel * 0.5)) {
    return "Advanced";
  }

  if (level >= 2) {
    return "Developing";
  }

  return "Basic";
};

export const getFacilityIcon = (facilityType: FacilityType): string => {
  if (facilityType === FacilityTypeValues.YouthAcademy) {
    return "school";
  }

  return "sports_soccer";
};

export const getFacilityIconToneClass = (facilityType: FacilityType): string => {
  if (facilityType === FacilityTypeValues.YouthAcademy) {
    return "text-secondary";
  }

  return "text-secondary-fixed-dim";
};

export const getFacilityGlowClass = (facilityType: FacilityType): string => {
  if (facilityType === FacilityTypeValues.YouthAcademy) {
    return "bg-secondary";
  }

  return "bg-secondary-container";
};

export const getCurrentEffectLabel = (facility: ClubFacility): string => {
  if (facility.facilityType === FacilityTypeValues.TrainingGround) {
    return `Lv. ${facility.level} morale & chemistry boosts`;
  }

  if (facility.facilityType === FacilityTypeValues.YouthAcademy) {
    return `Lv. ${facility.level} discipline focus`;
  }

  return `Level ${facility.level}`;
};

export const getNextEffectLabel = (facility: ClubFacility): string => {
  if (facility.isMaxLevel) {
    return "Max level reached";
  }

  if (facility.facilityType === FacilityTypeValues.TrainingGround) {
    return "+2 Morale, +2 Chemistry on upgrade";
  }

  if (facility.facilityType === FacilityTypeValues.YouthAcademy) {
    return "+1 Discipline on upgrade";
  }

  return "Improved facility effects";
};

export const getFacilityDetailPath = (facilityType: FacilityType): string => {
  return `/app/facilities/${facilityType}`;
};
