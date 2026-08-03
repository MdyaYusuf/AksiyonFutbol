import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { MatchResponse } from "../matchTypes";
import {
  formatMatchReportDateTime,
  getMatchStatusLabel,
  goBackOrFallback,
} from "../utils/matchReportHelpers";

interface MatchReportHeaderProps {
  match: MatchResponse;
}

export const MatchReportHeader = ({ match }: MatchReportHeaderProps) => {
  const navigate = useNavigate();
  const statusLabel = getMatchStatusLabel(match);
  const homeScore = match.isPlayed ? (match.homeScore ?? 0) : null;
  const awayScore = match.isPlayed ? (match.awayScore ?? 0) : null;

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2 text-on-surface-variant">
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

      <div className="relative flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-6 lg:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(34,197,94,0.12),_transparent_70%)] opacity-40" />

        <div className="relative z-10 mb-8 flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4 md:items-end">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high lg:h-32 lg:w-32">
              <MaterialIcon name="shield" className="text-5xl text-primary" filled />
            </div>
            <h2 className="text-center text-headline-md text-on-surface md:text-right">
              {match.homeClubName}
            </h2>
          </div>

          <div className="flex flex-col items-center justify-center px-4">
            <div className="mb-2 text-label-caps tracking-widest text-on-surface-variant uppercase">
              {statusLabel}
            </div>
            <div className="flex items-center gap-6 rounded-lg border border-outline-variant bg-surface-container-high px-8 py-4 text-display-lg text-primary shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]">
              {homeScore == null ? (
                <span className="text-headline-md text-on-surface-variant">VS</span>
              ) : (
                <>
                  <span>{homeScore}</span>
                  <span className="text-headline-md font-normal text-on-surface-variant opacity-50">
                    -
                  </span>
                  <span className="text-on-surface">{awayScore}</span>
                </>
              )}
            </div>
            <div className="mt-3 text-label-caps text-on-surface-variant">
              {match.divisionName} · GW {match.matchWeek}
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center gap-4 md:items-start">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high lg:h-32 lg:w-32">
              <MaterialIcon name="shield" className="text-5xl text-on-surface-variant" />
            </div>
            <h2 className="text-center text-headline-md text-on-surface md:text-left">
              {match.awayClubName}
            </h2>
          </div>
        </div>

        <div className="relative z-10 mt-2 grid grid-cols-1 gap-4 border-t border-outline-variant pt-6 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <span className="mb-1 text-label-caps text-on-surface-variant">Referee</span>
            <div className="flex items-center gap-2 text-on-surface">
              <MaterialIcon name="sports" className="text-sm opacity-70" />
              {match.refereeName ?? "—"}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="mb-1 text-label-caps text-on-surface-variant">Date & Time</span>
            <div className="flex items-center gap-2 text-on-surface">
              <MaterialIcon name="calendar_today" className="text-sm opacity-70" />
              {formatMatchReportDateTime(match.matchDate)}
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="mb-1 text-label-caps text-on-surface-variant">Competition</span>
            <div className="flex items-center gap-2 text-on-surface">
              <MaterialIcon name="stadium" className="text-sm opacity-70" />
              {match.divisionName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
