import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { formatCashFull } from "../../clubs/utils/clubOverviewHelpers";
import type { ClubFacility } from "../facilityTypes";
import {
  getCurrentEffectLabel,
  getFacilityDetailPath,
  getFacilityGlowClass,
  getFacilityIcon,
  getFacilityIconToneClass,
  getFacilityLevelLabel,
  getNextEffectLabel,
} from "../utils/facilitiesHubHelpers";

interface FacilityHubCardProps {
  facility: ClubFacility;
  clubCash: number;
}

export const FacilityHubCard = ({ facility, clubCash }: FacilityHubCardProps) => {
  const canAfford =
    !facility.isMaxLevel && facility.canUpgrade && clubCash >= facility.nextUpgradeCost;
  const detailPath = getFacilityDetailPath(facility.facilityType);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6 transition-colors hover:bg-surface-container-high">
      <div
        className={`absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-5 blur-2xl transition-opacity group-hover:opacity-10 ${getFacilityGlowClass(facility.facilityType)}`}
      />

      <div className="relative z-10 mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-low ${getFacilityIconToneClass(facility.facilityType)}`}
          >
            <MaterialIcon
              name={getFacilityIcon(facility.facilityType)}
              className="text-3xl"
            />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {facility.facilityTypeName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded border border-outline-variant bg-surface-variant px-2 py-1 font-label-caps text-label-caps text-on-surface">
                Lv. {facility.level}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {getFacilityLevelLabel(facility.level, facility.maxLevel)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-6 grid grid-cols-2 gap-4">
        <div>
          <div className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
            Current Effect
          </div>
          <div className="font-data-mono text-data-mono text-on-surface">
            {getCurrentEffectLabel(facility)}
          </div>
        </div>
        <div>
          <div className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
            Next Level
          </div>
          <div
            className={`font-data-mono text-data-mono ${
              facility.isMaxLevel ? "text-on-surface-variant" : "text-primary"
            }`}
          >
            {getNextEffectLabel(facility)}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
        <div>
          <div className="mb-1 font-label-caps text-label-caps text-on-surface-variant">
            Upgrade Cost
          </div>
          <div className="font-stat-value text-stat-value text-on-surface">
            {facility.isMaxLevel ? "—" : formatCashFull(facility.nextUpgradeCost)}
          </div>
        </div>

        {facility.isMaxLevel ? (
          <span className="flex items-center gap-2 rounded border border-outline-variant bg-surface-variant px-6 py-2 font-label-caps text-label-caps text-on-surface-variant opacity-50">
            <MaterialIcon name="check_circle" className="text-sm" />
            Max Level
          </span>
        ) : canAfford ? (
          <Link
            to={detailPath}
            className="flex items-center gap-2 rounded bg-primary px-6 py-2 font-label-caps text-label-caps text-on-primary transition-colors hover:bg-primary-fixed"
          >
            <MaterialIcon name="upgrade" className="text-sm" />
            Upgrade
          </Link>
        ) : (
          <Link
            to={detailPath}
            className="flex items-center gap-2 rounded border border-outline-variant bg-surface-variant px-6 py-2 font-label-caps text-label-caps text-on-surface opacity-70 transition-opacity hover:opacity-100"
          >
            <MaterialIcon name="lock" className="text-sm" />
            Insufficient Funds
          </Link>
        )}
      </div>
    </div>
  );
};
