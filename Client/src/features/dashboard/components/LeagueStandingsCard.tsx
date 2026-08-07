import { Link } from "react-router-dom";
import {
  formatGoalDifference,
  type StandingRow,
} from "../../leagueDivisions/utils/standingsHelpers";

interface LeagueStandingsCardProps {
  divisionName?: string;
  standings: StandingRow[];
  currentClubId?: string;
}

export const LeagueStandingsCard = ({
  divisionName,
  standings,
  currentClubId,
}: LeagueStandingsCardProps) => {
  const rows = standings.slice(0, 5);

  return (
    <div className="col-span-1 flex flex-col rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-4 lg:col-span-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-label-caps text-on-surface-variant">
          {divisionName ?? "League"}
        </h2>
        <Link to="/app/league" className="text-body-sm text-primary hover:underline">
          Full Table
        </Link>
      </div>

      <div className="flex-1 font-data-mono text-data-mono">
        <div className="mb-2 flex border-b border-surface-variant pb-2 text-xs text-on-surface-variant">
          <div className="w-8">#</div>
          <div className="flex-1">Club</div>
          <div className="w-8 text-center">P</div>
          <div className="w-8 text-center">GD</div>
          <div className="w-8 text-right font-bold">Pts</div>
        </div>

        {rows.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-on-surface-variant">
            No clubs in this division yet.
          </p>
        ) : (
          rows.map((row) => {
            const isCurrentClub = row.clubId === currentClubId;

            return (
              <div
                key={row.clubId}
                className={[
                  "flex items-center border-b border-surface-variant py-2 transition-colors last:border-b-0 hover:bg-surface-variant",
                  isCurrentClub
                    ? "-ml-0.5 border-l-2 border-l-primary bg-surface-container-high pl-2"
                    : "",
                ].join(" ")}
              >
                <div
                  className={`w-8 ${
                    isCurrentClub ? "font-bold text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {row.position}
                </div>
                <div
                  className={`flex-1 truncate ${
                    isCurrentClub ? "font-bold text-primary" : "text-on-surface"
                  }`}
                >
                  {row.clubName}
                </div>
                <div className="w-8 text-center text-on-surface-variant">
                  {row.played}
                </div>
                <div className="w-8 text-center text-on-surface-variant">
                  {formatGoalDifference(row.goalDifference)}
                </div>
                <div
                  className={`w-8 text-right font-bold ${
                    isCurrentClub ? "text-primary" : "text-on-surface"
                  }`}
                >
                  {row.points}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
