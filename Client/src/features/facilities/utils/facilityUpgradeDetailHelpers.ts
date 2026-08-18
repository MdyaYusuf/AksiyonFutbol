import type { ClubFacilitiesOverview, ClubFacility, FacilityType } from "../facilityTypes";
import { FacilityType as FacilityTypeValues } from "../facilityTypes";
import { formatSquadMoney } from "../../playerInstances/utils/squadHelpers";
import { getFacilityLevelLabel } from "./facilitiesHubHelpers";

export const parseFacilityTypeParam = (
  value: string | undefined,
): FacilityType | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (parsed === FacilityTypeValues.TrainingGround) {
    return FacilityTypeValues.TrainingGround;
  }

  if (parsed === FacilityTypeValues.YouthAcademy) {
    return FacilityTypeValues.YouthAcademy;
  }

  return null;
};

export const getFacilityHeroBadgeIcon = (facilityType: FacilityType): string => {
  if (facilityType === FacilityTypeValues.YouthAcademy) {
    return "school";
  }

  return "fitness_center";
};

export const getFacilityHeroDescription = (facilityType: FacilityType): string => {
  if (facilityType === FacilityTypeValues.YouthAcademy) {
    return "Upgrading sharpens youth development focus and reinforces squad discipline after each investment.";
  }

  return "Upgrading strengthens training quality. Each level grants an immediate morale and chemistry boost.";
};

export interface FacilityPerformanceStat {
  label: string;
  value: string;
  tone: "primary" | "secondary" | "neutral" | "error";
}

export const getFacilityPerformanceStats = (
  facility: ClubFacility,
  overview: ClubFacilitiesOverview,
): FacilityPerformanceStat[] => {
  if (facility.facilityType === FacilityTypeValues.TrainingGround) {
    return [
      {
        label: "Club Morale",
        value: String(overview.morale),
        tone: "primary",
      },
      {
        label: "Squad Chemistry",
        value: String(overview.chemistry),
        tone: "secondary",
      },
      {
        label: "Facility Grade",
        value: getFacilityLevelLabel(facility.level, facility.maxLevel),
        tone: "neutral",
      },
      {
        label: "Upgrade Reward",
        value: "+2 Morale / +2 Chem",
        tone: "neutral",
      },
    ];
  }

  return [
    {
      label: "Discipline",
      value: String(overview.discipline),
      tone: "primary",
    },
    {
      label: "Facility Grade",
      value: getFacilityLevelLabel(facility.level, facility.maxLevel),
      tone: "secondary",
    },
    {
      label: "Academy Focus",
      value: `Level ${facility.level}`,
      tone: "neutral",
    },
    {
      label: "Upgrade Reward",
      value: "+1 Discipline",
      tone: "neutral",
    },
  ];
};

export interface FacilityImpactRow {
  label: string;
  icon: string;
  from: string;
  to: string;
  isNegative?: boolean;
}

export const getProjectedImpactRows = (
  facility: ClubFacility,
  overview: ClubFacilitiesOverview,
): FacilityImpactRow[] => {
  if (facility.isMaxLevel) {
    return [];
  }

  const clamp = (value: number) => Math.min(100, Math.max(0, value));

  if (facility.facilityType === FacilityTypeValues.TrainingGround) {
    return [
      {
        label: "Club Morale",
        icon: "mood",
        from: String(overview.morale),
        to: String(clamp(overview.morale + 2)),
      },
      {
        label: "Squad Chemistry",
        icon: "groups",
        from: String(overview.chemistry),
        to: String(clamp(overview.chemistry + 2)),
      },
      {
        label: "Club Cash",
        icon: "payments",
        from: formatCompactCash(overview.clubCash),
        to: formatCompactCash(overview.clubCash - facility.nextUpgradeCost),
        isNegative: true,
      },
    ];
  }

  return [
    {
      label: "Discipline",
      icon: "gavel",
      from: String(overview.discipline),
      to: String(clamp(overview.discipline + 1)),
    },
    {
      label: "Club Cash",
      icon: "payments",
      from: formatCompactCash(overview.clubCash),
      to: formatCompactCash(overview.clubCash - facility.nextUpgradeCost),
      isNegative: true,
    },
  ];
};

export const getUpgradePathProgressPercent = (
  level: number,
  maxLevel: number,
): number => {
  if (maxLevel <= 1) {
    return 100;
  }

  const completedSteps = Math.max(0, level - 1);
  return (completedSteps / (maxLevel - 1)) * 100;
};

const formatCompactCash = (amount: number): string => formatSquadMoney(amount);
