import { Link } from "react-router-dom";
import { MaterialIcon } from "@/core/components/ui/MaterialIcon";
import type { UpcomingMatchSummary } from "@/features/actions/actionTypes";

interface ActionsFixtureBannerProps {
  upcomingMatch?: UpcomingMatchSummary | null;
}

export const ActionsFixtureBanner = ({ upcomingMatch }: ActionsFixtureBannerProps) => {
  if (!upcomingMatch) {
    return (
      <div className="mb-8 flex items-center gap-3 rounded border border-outline-variant bg-surface-container p-3">
        <MaterialIcon name="event_busy" className="text-on-surface-variant" />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          No upcoming fixture. Match-scoped actions are unavailable until the next match
          is scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col gap-3 rounded border border-outline-variant bg-surface-container p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <MaterialIcon name="event" className="text-secondary" />
        <span className="font-label-caps text-label-caps text-on-surface-variant">
          Next Fixture:
        </span>
        <span className="font-body-sm font-semibold text-on-surface">
          Week {upcomingMatch.matchWeek} · {upcomingMatch.homeClubName} vs{" "}
          {upcomingMatch.awayClubName}
          {upcomingMatch.isHome ? " (Home)" : " (Away)"}
        </span>
      </div>
      <Link
        to={`/app/matches/${upcomingMatch.matchId}/lineup`}
        className="text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary-fixed"
      >
        Preview
      </Link>
    </div>
  );
};
