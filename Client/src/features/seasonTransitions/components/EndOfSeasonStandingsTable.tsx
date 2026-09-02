import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { CondensedStandingRow } from "@/features/seasonTransitions/utils/endOfSeasonHelpers";
import { formatGoalDifference, getClubInitial } from "@/features/seasonTransitions/utils/endOfSeasonHelpers";

interface EndOfSeasonStandingsTableProps {
  rows: CondensedStandingRow[];
  currentClubId: string;
  promotedClubIds: Set<string>;
  relegatedClubIds: Set<string>;
  matchWeekLabel: string;
}

export const EndOfSeasonStandingsTable = ({
  rows,
  currentClubId,
  promotedClubIds,
  relegatedClubIds,
  matchWeekLabel,
}: EndOfSeasonStandingsTableProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-sm xl:col-span-2">
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-lowest p-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-on-surface">
          <MaterialIcon name="format_list_numbered" className="text-on-surface-variant" />
          Final Standings
        </h2>
        <span className="text-sm font-medium text-on-surface-variant">{matchWeekLabel}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-low text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              <th className="w-12 px-4 py-4 text-center">Pos</th>
              <th className="px-4 py-4">Club</th>
              <th className="w-12 px-4 py-4 text-center">P</th>
              <th className="w-12 px-4 py-4 text-center">W</th>
              <th className="w-12 px-4 py-4 text-center">D</th>
              <th className="w-12 px-4 py-4 text-center">L</th>
              <th className="w-16 px-4 py-4 text-center">GD</th>
              <th className="w-16 px-4 py-4 text-center">Pts</th>
            </tr>
          </thead>
          <tbody className="text-sm font-medium">
            {rows.map((entry) => {
              if (entry.kind === "ellipsis") {
                return (
                  <tr key={entry.key}>
                    <td
                      colSpan={8}
                      className="border-b border-outline-variant bg-surface-container-low py-2 text-center text-xs text-on-surface-variant"
                    >
                      <MaterialIcon name="more_vert" className="align-middle text-base" />
                    </td>
                  </tr>
                );
              }

              const { row, zone } = entry;
              const isUser = row.clubId === currentClubId;
              const isPromoted = promotedClubIds.has(row.clubId);
              const isRelegated = relegatedClubIds.has(row.clubId);
              const isChampion = isPromoted && row.position === 1;

              const rowClass =
                zone === "promoted"
                  ? "border-b border-outline-variant bg-primary/10 hover:bg-primary/15"
                  : zone === "relegated"
                    ? "border-b border-outline-variant bg-error-container/40 hover:bg-error-container/60"
                    : zone === "user"
                      ? "relative z-10 scale-[1.01] border-b-2 border-primary bg-surface-container-high shadow-md"
                      : "border-b border-outline-variant hover:bg-surface-variant";

              return (
                <tr key={row.clubId} className={rowClass}>
                  <td className={`px-4 text-center ${isUser ? "py-5" : "py-4"}`}>
                    {isPromoted || isRelegated ? (
                      <span
                        className={[
                          "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                          isPromoted
                            ? "bg-primary text-on-primary"
                            : "bg-error text-on-error",
                        ].join(" ")}
                      >
                        {row.position}
                      </span>
                    ) : (
                      <span
                        className={`text-on-surface-variant ${isUser ? "text-lg font-bold text-on-surface" : ""}`}
                      >
                        {row.position}
                      </span>
                    )}
                  </td>
                  <td className={`px-4 ${isUser ? "py-5 text-lg font-black" : "py-4 font-bold"}`}>
                    <div className="flex items-center gap-3">
                      <div
                        className={[
                          "flex items-center justify-center overflow-hidden rounded-full border border-outline-variant bg-surface shadow-sm",
                          isUser ? "h-10 w-10 border-2 border-primary" : "h-8 w-8",
                        ].join(" ")}
                      >
                        <span className="text-xs font-bold text-on-surface-variant">
                          {getClubInitial(row.clubName)}
                        </span>
                      </div>
                      <span className={isRelegated ? "text-error" : "text-on-surface"}>
                        {row.clubName}
                      </span>
                      {isChampion ? (
                        <MaterialIcon
                          name="emoji_events"
                          className="text-sm text-primary"
                        />
                      ) : null}
                      {isPromoted && !isChampion ? (
                        <MaterialIcon
                          name="arrow_upward"
                          className="text-sm text-primary"
                        />
                      ) : null}
                      {isRelegated ? (
                        <MaterialIcon
                          name="arrow_downward"
                          className="text-sm text-error"
                        />
                      ) : null}
                      {isUser ? (
                        <span className="ml-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-on-primary uppercase">
                          You
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-on-surface-variant">{row.played}</td>
                  <td className="px-4 py-4 text-center">{row.won}</td>
                  <td className="px-4 py-4 text-center">{row.drawn}</td>
                  <td className="px-4 py-4 text-center">{row.lost}</td>
                  <td className="px-4 py-4 text-center">
                    {formatGoalDifference(row.goalDifference)}
                  </td>
                  <td
                    className={`px-4 py-4 text-center font-bold ${isUser ? "text-xl font-black" : "text-lg"}`}
                  >
                    {row.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
