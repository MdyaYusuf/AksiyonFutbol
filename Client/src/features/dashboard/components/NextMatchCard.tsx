import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { MatchPreview } from "../../matches/matchTypes";
import {
  getMatchLivePath,
  getMatchPresentationPhase,
  getMatchReportPath,
} from "../../matches/utils/matchLiveHelpers";
import { formatMatchDateTime } from "../utils/dashboardFormatters";

interface NextMatchCardProps {
  clubId: string;
  nextMatch?: MatchPreview;
}

const TeamBadge = ({
  name,
  isUserClub,
  homeAway,
}: {
  name: string;
  isUserClub: boolean;
  homeAway: "H" | "A";
}) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className={[
        "flex h-16 w-16 items-center justify-center rounded-full border bg-background p-2 md:h-20 md:w-20",
        isUserClub
          ? "border-primary shadow-[0_0_15px_rgba(34,197,94,0.15)]"
          : "border-outline",
      ].join(" ")}
    >
      <MaterialIcon
        name="shield"
        className={isUserClub ? "text-primary" : "text-on-surface-variant"}
      />
    </div>
    <span
      className={`text-headline-sm ${isUserClub ? "text-on-surface" : "text-on-surface-variant"}`}
    >
      {name}
    </span>
    <span
      className={`text-label-caps ${isUserClub ? "text-primary" : "text-on-surface-variant"}`}
    >
      ({homeAway})
    </span>
  </div>
);

export const NextMatchCard = ({ clubId, nextMatch }: NextMatchCardProps) => {
  if (!nextMatch) {
    return (
      <div className="relative col-span-1 flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-8 lg:col-span-8">
        <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
        <h2 className="text-label-caps text-on-surface-variant">Next Match</h2>
        <p className="py-12 text-center text-body-sm text-on-surface-variant">
          No upcoming fixtures scheduled.
        </p>
      </div>
    );
  }

  const userIsHome = nextMatch.homeClubId === clubId;
  const phase = getMatchPresentationPhase(nextMatch, new Date());
  const livePath = getMatchLivePath(nextMatch.id);
  const reportPath = getMatchReportPath(nextMatch.id);
  const scoreLabel =
    nextMatch.isPlayed && nextMatch.homeScore != null && nextMatch.awayScore != null
      ? `${nextMatch.homeScore} - ${nextMatch.awayScore}`
      : null;

  return (
    <div className="relative col-span-1 flex flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-high p-4 md:col-span-8 lg:col-span-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, #ffffff 40px, #ffffff 42px)",
        }}
      />
      <div className="relative z-10 mb-4 flex items-center justify-between">
        <h2 className="text-label-caps text-on-surface-variant">Next Match</h2>
        <span className="rounded border border-outline-variant bg-background px-2 py-1 font-data-mono text-data-mono text-on-surface">
          {scoreLabel ?? formatMatchDateTime(nextMatch.matchDate)}
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-6">
        <div className="flex w-full items-center justify-center gap-8 md:gap-16">
          <TeamBadge
            name={nextMatch.homeClubName}
            isUserClub={userIsHome}
            homeAway="H"
          />
          <div className="flex flex-col items-center gap-1">
            <span className="text-headline-md text-on-surface-variant">
              {scoreLabel ?? "VS"}
            </span>
            <span className="font-data-mono text-[10px] text-on-surface-variant">
              GW {nextMatch.matchWeek}
            </span>
          </div>
          <TeamBadge
            name={nextMatch.awayClubName}
            isUserClub={!userIsHome}
            homeAway="A"
          />
        </div>
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap justify-end gap-3 border-t border-surface-variant pt-4">
        {phase === "upcoming" ? (
          <>
            <Link
              to="/app/influence"
              className="rounded border border-outline-variant bg-transparent px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Match Influence
            </Link>
            <Link
              to={reportPath}
              className="rounded border border-outline-variant bg-transparent px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Scout Report
            </Link>
            <Link
              to={`/app/matches/${nextMatch.id}/lineup`}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
            >
              <MaterialIcon name="groups" className="text-sm" />
              Set Lineup
            </Link>
          </>
        ) : null}

        {phase === "waitingSim" || phase === "live" ? (
          <Link
            to={livePath}
            className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
          >
            <MaterialIcon name="play_circle" className="text-sm" />
            Watch live
          </Link>
        ) : null}

        {phase === "replay" ? (
          <>
            <Link
              to={reportPath}
              className="rounded border border-outline-variant bg-transparent px-4 py-2 text-body-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Match Report
            </Link>
            <Link
              to={livePath}
              className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-body-sm font-semibold text-on-primary transition-colors hover:bg-primary-fixed"
            >
              <MaterialIcon name="replay" className="text-sm" />
              Watch replay
            </Link>
          </>
        ) : null}
      </div>
    </div>
  );
};
