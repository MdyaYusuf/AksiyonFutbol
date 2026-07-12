import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { MatchResponse } from "../matchTypes";
import { formatAdminMatchDateTime } from "../utils/adminMatchesHelpers";

interface AdminMatchesTableProps {
  matches: MatchResponse[];
  simulatingMatchId?: string | null;
  onSimulate: (matchId: string) => void;
  onEdit: (matchId: string) => void;
  onDelete: (matchId: string) => void;
}

export const AdminMatchesTable = ({
  matches,
  simulatingMatchId,
  onSimulate,
  onEdit,
  onDelete,
}: AdminMatchesTableProps) => {
  return (
    <div className="flex-1 overflow-auto bg-surface p-container-padding">
      <table className="w-full border-collapse text-left">
        <thead className="sticky top-0 z-10 bg-surface shadow-[0_1px_0_#334155]">
          <tr>
            <th className="pb-3 font-normal text-label-caps text-on-surface-variant">Wk</th>
            <th className="pb-3 font-normal text-label-caps text-on-surface-variant">
              Date / Time
            </th>
            <th className="pb-3 text-right font-normal text-label-caps text-on-surface-variant">
              Home
            </th>
            <th className="pb-3 text-center font-normal text-label-caps text-on-surface-variant">
              Score
            </th>
            <th className="pb-3 font-normal text-label-caps text-on-surface-variant">Away</th>
            <th className="pb-3 font-normal text-label-caps text-on-surface-variant">Referee</th>
            <th className="pb-3 font-normal text-label-caps text-on-surface-variant">Status</th>
            <th className="pb-3 text-right font-normal text-label-caps text-on-surface-variant">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-body-sm">
          {matches.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-10 text-center text-on-surface-variant">
                No matches found.
              </td>
            </tr>
          ) : (
            matches.map((match) => {
              const isPlayed = match.isPlayed;

              return (
                <tr
                  key={match.id}
                  className="group border-b border-surface-variant transition-colors hover:bg-surface-container"
                >
                  <td
                    className={`py-3 ${isPlayed ? "text-on-surface-variant" : "text-on-surface"}`}
                  >
                    {match.matchWeek}
                  </td>
                  <td
                    className={`py-3 font-data-mono text-data-mono ${isPlayed ? "text-on-surface-variant" : "text-on-surface"}`}
                  >
                    {formatAdminMatchDateTime(match.matchDate)}
                  </td>
                  <td
                    className={`py-3 text-right ${isPlayed ? "font-medium text-on-surface-variant" : "font-bold text-on-surface"}`}
                  >
                    {match.homeClubName}
                  </td>
                  <td className="py-3 text-center">
                    {isPlayed ? (
                      <span className="text-stat-value text-primary">
                        {match.homeScore ?? 0} - {match.awayScore ?? 0}
                      </span>
                    ) : (
                      <span className="font-data-mono text-on-surface-variant">vs</span>
                    )}
                  </td>
                  <td
                    className={`py-3 ${isPlayed ? "font-medium text-on-surface-variant" : "font-bold text-on-surface"}`}
                  >
                    {match.awayClubName}
                  </td>
                  <td className="py-3 text-on-surface-variant">
                    {match.refereeName?.trim() || "—"}
                  </td>
                  <td className="py-3">
                    {isPlayed ? (
                      <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Played
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-secondary/20 bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
                        Scheduled
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    {isPlayed ? (
                      <Link
                        to={`/app/matches/${match.id}`}
                        className="ml-auto flex items-center justify-end gap-1 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                      >
                        <MaterialIcon name="visibility" className="text-sm" />
                        Report
                      </Link>
                    ) : (
                      <div className="flex items-center justify-end gap-3 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                        <button
                          type="button"
                          title="Simulate"
                          onClick={() => onSimulate(match.id)}
                          disabled={simulatingMatchId === match.id}
                          className="text-on-surface-variant transition-colors hover:text-secondary disabled:opacity-50"
                        >
                          <MaterialIcon name="play_circle" className="text-sm" />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => onEdit(match.id)}
                          className="text-on-surface-variant transition-colors hover:text-primary"
                        >
                          <MaterialIcon name="edit_calendar" className="text-sm" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => onDelete(match.id)}
                          className="text-on-surface-variant transition-colors hover:text-error"
                        >
                          <MaterialIcon name="delete" className="text-sm" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
