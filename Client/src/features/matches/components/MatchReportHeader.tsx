import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { MatchResponse } from "@/features/matches/matchTypes";
import {
  formatMatchReportDateTime,
  getMatchStatusLabel,
  goBackOrFallback,
} from "@/features/matches/utils/matchReportHelpers";

interface MatchReportHeaderProps {
  match: MatchResponse;
}

export const MatchReportHeader = ({ match }: MatchReportHeaderProps) => {
  const navigate = useNavigate();
  const statusLabel = getMatchStatusLabel(match);
  const homeScore = match.isPlayed ? (match.homeScore ?? 0) : null;
  const awayScore = match.isPlayed ? (match.awayScore ?? 0) : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <button
          type="button"
          onClick={() => goBackOrFallback(navigate, "/app/fixtures")}
          className="flex items-center gap-1 transition-colors hover:text-primary"
        >
          <MaterialIcon name="arrow_back" className="text-sm" />
          <span className="text-label-caps">Go back</span>
        </button>
        <MaterialIcon name="chevron_right" className="text-sm" />
        <span className="text-label-caps text-on-surface">Match Report</span>
      </div>

      <div className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 md:px-4">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="text-label-caps text-on-surface-variant">{statusLabel}</span>
          <span className="text-label-caps text-on-surface-variant">
            {match.divisionName} · Game Week {match.matchWeek}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-body-sm font-semibold text-on-surface md:text-headline-sm">
              {match.homeClubName}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-data-mono text-stat-value text-primary">
            {homeScore == null ? (
              <span className="text-body-sm text-on-surface-variant">VS</span>
            ) : (
              <>
                <span>{homeScore}</span>
                <span className="text-on-surface-variant opacity-50">-</span>
                <span className="text-on-surface">{awayScore}</span>
              </>
            )}
          </div>

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-body-sm font-semibold text-on-surface md:text-headline-sm">
              {match.awayClubName}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-outline-variant pt-2 text-body-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <MaterialIcon name="sports" className="text-sm opacity-70" />
            {match.refereeName ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <MaterialIcon name="calendar_today" className="text-sm opacity-70" />
            {formatMatchReportDateTime(match.matchDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <MaterialIcon name="stadium" className="text-sm opacity-70" />
            {match.divisionName}
          </span>
        </div>
      </div>
    </div>
  );
};
