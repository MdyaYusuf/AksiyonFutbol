import { Link } from "react-router-dom";
import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import { getMatchResultLetter } from "../../dashboard/utils/matchHelpers";
import type { MatchPreview } from "../matchTypes";
import {
  formatFixtureDateTime,
  getScoreBadgeClassName,
  getScoreDisplay,
} from "../utils/fixturesHelpers";

interface FixtureRowProps {
  match: MatchPreview;
  clubId: string;
}

const TeamCell = ({
  name,
  isUserClub,
  align,
}: {
  name: string;
  isUserClub: boolean;
  align: "home" | "away";
}) => {
  const isHome = align === "home";

  return (
    <div
      className={[
        "col-span-5 flex items-center gap-3 text-headline-sm md:col-span-4",
        isHome ? "justify-start md:justify-end" : "justify-start",
        isUserClub ? "font-bold text-on-surface" : "text-on-surface-variant",
      ].join(" ")}
    >
      <span className="w-16 text-label-caps text-on-surface-variant md:hidden">
        {isHome ? "Home:" : "Away:"}
      </span>
      {isHome ? (
        <>
          <span className="truncate">{name}</span>
          <div className="hidden h-6 w-6 items-center justify-center rounded bg-surface-variant md:flex">
            <MaterialIcon
              name="shield"
              className={`text-sm ${isUserClub ? "text-primary" : "text-on-surface-variant"}`}
            />
          </div>
        </>
      ) : (
        <>
          <div className="hidden h-6 w-6 items-center justify-center rounded bg-surface-variant md:flex">
            <MaterialIcon
              name="shield"
              className={`text-sm ${isUserClub ? "text-primary" : "text-on-surface-variant"}`}
            />
          </div>
          <span className="truncate">{name}</span>
        </>
      )}
    </div>
  );
};

export const FixtureRow = ({ match, clubId }: FixtureRowProps) => {
  const scoreDisplay = getScoreDisplay(match);
  const badgeClassName = getScoreBadgeClassName(match, clubId);
  const isWin = getMatchResultLetter(match, clubId) === "W";
  const isUpcoming = !match.isPlayed;

  return (
    <Link
      to={`/app/matches/${match.id}`}
      className={[
        "grid grid-cols-1 items-center gap-2 border-b border-surface-container-highest px-4 py-4 transition-colors last:border-b-0 hover:bg-surface-container-highest md:grid-cols-12 md:gap-4 md:py-3",
        isUpcoming ? "opacity-80" : "",
      ].join(" ")}
    >
      <div className="col-span-12 flex items-center gap-2 font-data-mono text-data-mono text-on-surface-variant md:col-span-2">
        <span className="w-16 text-label-caps md:hidden">Date:</span>
        {formatFixtureDateTime(match.matchDate)}
      </div>

      <TeamCell
        name={match.homeClubName}
        isUserClub={match.homeClubId === clubId}
        align="home"
      />

      <div className="col-span-2 flex items-center justify-center md:col-span-2">
        <div className={`flex items-center gap-2 rounded px-3 py-1 ${badgeClassName}`}>
          {isWin && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />}
          {scoreDisplay}
        </div>
      </div>

      <TeamCell
        name={match.awayClubName}
        isUserClub={match.awayClubId === clubId}
        align="away"
      />
    </Link>
  );
};
