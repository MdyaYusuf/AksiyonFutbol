import type { ClubFacility } from "../facilityTypes";
import { getUpgradePathProgressPercent } from "../utils/facilityUpgradeDetailHelpers";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";

interface FacilityUpgradePathProps {
  facility: ClubFacility;
}

export const FacilityUpgradePath = ({ facility }: FacilityUpgradePathProps) => {
  const levels = Array.from({ length: facility.maxLevel }, (_, index) => index + 1);
  const progressPercent = getUpgradePathProgressPercent(
    facility.level,
    facility.maxLevel,
  );
  const targetLevel = facility.isMaxLevel ? facility.level : facility.level + 1;

  return (
    <div className="relative z-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
          <MaterialIcon name="trending_up" className="text-primary" />
          Upgrade Path
        </h3>
        <div className="rounded border border-outline-variant bg-surface-variant px-3 py-1 font-label-caps text-label-caps text-on-surface">
          {facility.isMaxLevel ? "Max Level" : `Targeting Level ${targetLevel}`}
        </div>
      </div>

      <div className="relative mb-4 flex items-center justify-between px-4">
        <div className="absolute top-1/2 right-6 left-6 z-0 h-1 -translate-y-1/2 rounded-full bg-surface-variant">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {levels.map((level) => {
          const isCurrent = level === facility.level;
          const isCompleted = level < facility.level;
          const isNext = !facility.isMaxLevel && level === facility.level + 1;

          return (
            <div key={level} className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={[
                  "flex items-center justify-center rounded-full font-bold",
                  isCurrent
                    ? "h-10 w-10 scale-110 border-4 border-surface bg-primary text-on-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    : isNext
                      ? "h-10 w-10 border-2 border-outline-variant bg-surface-variant text-on-surface-variant"
                      : isCompleted
                        ? "h-8 w-8 border-2 border-primary bg-surface-container text-primary"
                        : "h-8 w-8 border-2 border-outline-variant bg-surface-container text-on-surface-variant/50",
                ].join(" ")}
              >
                {level}
              </div>
              {isCurrent ? (
                <span className="absolute -bottom-6 font-label-caps text-label-caps whitespace-nowrap text-primary">
                  Current
                </span>
              ) : null}
              {isNext ? (
                <span className="absolute -bottom-6 font-label-caps text-label-caps whitespace-nowrap text-on-surface-variant">
                  Next
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
};
