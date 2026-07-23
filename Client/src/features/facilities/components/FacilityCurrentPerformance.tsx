import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { FacilityPerformanceStat } from "../utils/facilityUpgradeDetailHelpers";

interface FacilityCurrentPerformanceProps {
  stats: FacilityPerformanceStat[];
}

const toneClass: Record<FacilityPerformanceStat["tone"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  neutral: "text-on-surface",
  error: "text-error",
};

export const FacilityCurrentPerformance = ({
  stats,
}: FacilityCurrentPerformanceProps) => {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
      <h3 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-on-surface-variant">
        <MaterialIcon name="bar_chart" className="text-[16px]" />
        Current Facility Performance
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="mb-1 font-body-sm text-body-sm text-on-surface-variant">
              {stat.label}
            </div>
            <div className={`font-stat-value text-stat-value ${toneClass[stat.tone]}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
