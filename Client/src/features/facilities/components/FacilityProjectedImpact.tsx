import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { FacilityImpactRow } from "../utils/facilityUpgradeDetailHelpers";

interface FacilityProjectedImpactProps {
  targetLevel: number;
  rows: FacilityImpactRow[];
}

export const FacilityProjectedImpact = ({
  targetLevel,
  rows,
}: FacilityProjectedImpactProps) => {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          This facility is already at maximum level.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-5">
      <h4 className="mb-4 font-label-caps text-label-caps text-on-surface-variant">
        Projected Impact (Level {targetLevel})
      </h4>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => {
          const isLast = index === rows.length - 1;

          return (
            <div
              key={row.label}
              className={[
                "flex items-center justify-between",
                isLast ? "" : "border-b border-outline-variant pb-2",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded",
                    row.isNegative ? "bg-error/10 text-error" : "bg-primary/10 text-primary",
                  ].join(" ")}
                >
                  <MaterialIcon name={row.icon} className="text-[16px]" />
                </div>
                <span className="font-body-sm text-body-sm text-on-surface">
                  {row.label}
                </span>
              </div>
              <div className="flex items-center gap-2 font-data-mono text-data-mono">
                <span className="text-on-surface-variant">{row.from}</span>
                <MaterialIcon
                  name="arrow_right_alt"
                  className={`text-[16px] ${row.isNegative ? "text-error" : "text-primary"}`}
                />
                <span
                  className={`font-bold ${row.isNegative ? "text-error" : "text-primary"}`}
                >
                  {row.to}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
