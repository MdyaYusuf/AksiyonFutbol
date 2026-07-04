import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { ProgressBar } from "../../../core/components/ui/ProgressBar";
import { getMoraleLabel } from "../../dashboard/utils/dashboardFormatters";
import type { ClubResponse } from "../clubTypes";
import { getMoraleSegmentCount } from "../utils/clubOverviewHelpers";

interface SquadAtmosphereCardProps {
  club: ClubResponse;
}

export const SquadAtmosphereCard = ({ club }: SquadAtmosphereCardProps) => {
  const filledSegments = getMoraleSegmentCount(club.morale);
  const moraleLabel = getMoraleLabel(club.morale);

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-high p-6 xl:col-span-4">
      <h3 className="mb-6 flex items-center gap-2 text-headline-sm text-on-surface">
        <MaterialIcon name="psychology" className="text-[20px] text-secondary" />
        Squad Atmosphere
      </h3>

      <div className="space-y-6">
        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-body-sm text-on-surface-variant">Overall Morale</span>
            <span className="text-stat-value text-primary">{moraleLabel}</span>
          </div>
          <div className="flex h-2 gap-1">
            {Array.from({ length: 5 }, (_, index) => {
              const isFilled = index < filledSegments;
              const isFirst = index === 0;
              const isLast = index === 4;

              return (
                <div
                  key={index}
                  className={[
                    "flex-1",
                    isFilled ? "bg-primary" : "bg-surface-container-highest",
                    isFirst ? "rounded-l" : "",
                    isLast ? "rounded-r" : "",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-body-sm text-on-surface-variant">Manager Support</span>
            <span className="text-stat-value text-on-surface">{club.chemistry}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded bg-surface-container-highest">
            <div
              className="h-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]"
              style={{ width: `${Math.min(100, Math.max(0, club.chemistry))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-end justify-between">
            <span className="text-body-sm text-on-surface-variant">Discipline</span>
            <span className="text-stat-value text-on-surface">{club.discipline}%</span>
          </div>
          <ProgressBar value={club.discipline} />
        </div>
      </div>
    </div>
  );
};
