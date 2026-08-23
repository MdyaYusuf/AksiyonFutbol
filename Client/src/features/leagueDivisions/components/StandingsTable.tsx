import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { StandingRow, StandingsLegendItem } from "../utils/standingsHelpers";
import {
  formatGoalDifference,
  getFormBadgeClassName,
  getZoneDotClassName,
} from "../utils/standingsHelpers";
import { StandingResultPopover } from "./StandingResultPopover";

interface StandingsTableProps {
  standings: StandingRow[];
  currentClubId?: string;
  legendItems?: StandingsLegendItem[];
}

export const StandingsTable = ({
  standings,
  currentClubId,
  legendItems = [],
}: StandingsTableProps) => {
  if (standings.length === 0) {
    return (
      <div className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-12 text-center text-body-sm text-on-surface-variant">
        No clubs in this division yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-lg">
      <div className="w-full overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high text-label-caps tracking-wider text-on-surface-variant uppercase">
              <th className="w-12 px-4 py-3 text-center">Pos</th>
              <th className="min-w-[200px] px-4 py-3">Club</th>
              <th className="w-16 px-4 py-3 text-center" title="Played">
                Pld
              </th>
              <th className="w-16 px-4 py-3 text-center" title="Won">
                W
              </th>
              <th className="w-16 px-4 py-3 text-center" title="Drawn">
                D
              </th>
              <th className="w-16 px-4 py-3 text-center" title="Lost">
                L
              </th>
              <th className="w-24 px-4 py-3 text-center" title="Goals For/Against">
                GF:GA
              </th>
              <th className="w-16 px-4 py-3 text-center" title="Goal Difference">
                GD
              </th>
              <th className="w-16 px-4 py-3 text-center font-bold text-on-surface">Pts</th>
              <th className="w-32 px-4 py-3 text-center">Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant font-data-mono text-data-mono text-on-surface">
            {standings.map((row) => {
              const isCurrentClub = row.clubId === currentClubId;
              const gdClassName =
                row.goalDifference > 0
                  ? "text-primary-container"
                  : row.goalDifference < 0
                    ? "text-error"
                    : "text-on-surface-variant";
              const countClassName = isCurrentClub
                ? "text-primary/80 group-hover:text-primary"
                : "text-on-surface-variant group-hover:text-on-surface";

              return (
                <tr
                  key={row.clubId}
                  className={[
                    "group transition-colors",
                    isCurrentClub
                      ? "border-l-4 border-primary-container bg-[#1e2e1e] hover:bg-[#253825]"
                      : "hover:bg-surface-variant",
                  ].join(" ")}
                >
                  <td className="px-4 py-2.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${getZoneDotClassName(row.zone)}`}
                      />
                      {row.position}
                    </div>
                  </td>
                  <td
                    className={[
                      "px-4 py-2.5 text-body-sm",
                      isCurrentClub
                        ? "font-bold text-primary"
                        : "font-semibold text-on-surface",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                        <MaterialIcon
                          name="shield"
                          className={`text-sm ${isCurrentClub ? "text-primary" : "text-on-surface-variant"}`}
                        />
                      </div>
                      {row.clubName}
                      {isCurrentClub ? " (You)" : ""}
                    </div>
                  </td>
                  <td className={`px-4 py-2.5 text-center ${countClassName}`}>
                    {row.played}
                  </td>
                  <td className={`px-4 py-2.5 text-center ${countClassName}`}>
                    <StandingResultPopover
                      clubName={row.clubName}
                      outcome="W"
                      results={row.matchResults}
                      className="inline-flex cursor-pointer justify-center"
                    >
                      {row.won}
                    </StandingResultPopover>
                  </td>
                  <td className={`px-4 py-2.5 text-center ${countClassName}`}>
                    <StandingResultPopover
                      clubName={row.clubName}
                      outcome="D"
                      results={row.matchResults}
                      className="inline-flex cursor-pointer justify-center"
                    >
                      {row.drawn}
                    </StandingResultPopover>
                  </td>
                  <td className={`px-4 py-2.5 text-center ${countClassName}`}>
                    <StandingResultPopover
                      clubName={row.clubName}
                      outcome="L"
                      results={row.matchResults}
                      className="inline-flex cursor-pointer justify-center"
                    >
                      {row.lost}
                    </StandingResultPopover>
                  </td>
                  <td className={`px-4 py-2.5 text-center ${countClassName}`}>
                    {row.goalsFor}:{row.goalsAgainst}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-center ${isCurrentClub ? "text-primary" : gdClassName}`}
                  >
                    {formatGoalDifference(row.goalDifference)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-center text-[15px] font-bold ${isCurrentClub ? "text-primary" : ""}`}
                  >
                    {row.points}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.length === 0 ? (
                        <span className="text-on-surface-variant">—</span>
                      ) : (
                        row.form.map((result, index) => (
                          <span
                            key={`${row.clubId}-form-${index}`}
                            className={`flex h-4 w-4 items-center justify-center rounded-sm border text-[10px] font-bold ${getFormBadgeClassName(result)}`}
                          >
                            {result}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {legendItems.length > 0 ? (
        <div className="flex flex-wrap gap-6 border-t border-outline-variant bg-surface-container-highest px-6 py-3 text-label-caps text-on-surface-variant">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getZoneDotClassName(item.zone)}`} />
              {item.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
