import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { ClubFacility, FacilityType } from "../facilityTypes";
import { getFacilityLevelLabel } from "../utils/facilitiesHubHelpers";
import {
  getFacilityHeroBadgeIcon,
  getFacilityHeroDescription,
} from "../utils/facilityUpgradeDetailHelpers";

interface FacilityUpgradeHeroProps {
  facility: ClubFacility;
}

export const FacilityUpgradeHero = ({ facility }: FacilityUpgradeHeroProps) => {
  const grade = getFacilityLevelLabel(facility.level, facility.maxLevel);

  return (
    <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-outline-variant shadow-lg">
      <div
        className={[
          "absolute inset-0 transition-transform duration-700 group-hover:scale-105",
          getHeroGradient(facility.facilityType),
        ].join(" ")}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background to-transparent opacity-80" />

      <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 opacity-20">
        <MaterialIcon
          name={getFacilityHeroBadgeIcon(facility.facilityType)}
          className="text-[120px] text-on-surface"
        />
      </div>

      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-high/90 px-3 py-1.5 backdrop-blur-sm">
          <MaterialIcon
            name={getFacilityHeroBadgeIcon(facility.facilityType)}
            className="text-sm text-primary"
            filled
          />
          <span className="font-label-caps text-label-caps text-on-surface">
            Level {facility.level} Current
          </span>
        </div>
      </div>

      <div className="absolute right-4 bottom-4 left-4 z-20">
        <h2 className="mb-1 font-headline-sm text-headline-sm text-on-surface shadow-sm">
          {grade} Complex
        </h2>
        <p className="max-w-sm font-body-sm text-body-sm text-on-surface-variant">
          {getFacilityHeroDescription(facility.facilityType)}
        </p>
      </div>
    </div>
  );
};

const getHeroGradient = (facilityType: FacilityType): string => {
  if (facilityType === 2) {
    return "bg-gradient-to-br from-surface-container-highest via-on-primary-fixed-variant/40 to-surface-container-low";
  }

  return "bg-gradient-to-br from-surface-container-high via-primary/20 to-surface-container-lowest";
};
