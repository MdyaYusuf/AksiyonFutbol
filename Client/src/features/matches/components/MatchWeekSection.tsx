import type { MatchWeekGroup } from "../utils/fixturesHelpers";
import { FixtureRow } from "./FixtureRow";

interface MatchWeekSectionProps {
  group: MatchWeekGroup;
  clubId: string;
}

export const MatchWeekSection = ({ group, clubId }: MatchWeekSectionProps) => {
  return (
    <div>
      <h3 className="mb-3 flex items-center gap-2 text-label-caps tracking-wider text-on-surface-variant uppercase">
        <span
          className={`h-2 w-2 rounded-full ${group.hasUpcoming ? "bg-secondary" : "bg-surface-variant"}`}
        />
        Match Week {group.matchWeek}
      </h3>

      <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-low">
        <div className="hidden grid-cols-12 gap-4 border-b border-surface-container-highest bg-surface-container px-4 py-2 text-label-caps text-on-surface-variant md:grid">
          <div className="col-span-2">Date/Time</div>
          <div className="col-span-4 text-right">Home</div>
          <div className="col-span-2 text-center">Score</div>
          <div className="col-span-4 text-left">Away</div>
        </div>

        {group.matches.map((match) => (
          <FixtureRow key={match.id} match={match} clubId={clubId} />
        ))}
      </div>
    </div>
  );
};
