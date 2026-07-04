import { MaterialIcon } from "../../../core/components/ui/MaterialIcon";
import type { MatchResponse } from "../matchTypes";
import type { MatchEvent } from "../matchTypes";
import {
  buildMatchSideStats,
  getDominanceBarWidth,
} from "../utils/matchReportHelpers";

interface MatchDominancePanelProps {
  match: MatchResponse;
  events: MatchEvent[];
}

const DominanceStatRow = ({
  label,
  homeValue,
  awayValue,
  formatValue = (value: number) => String(value),
}: {
  label: string;
  homeValue: number;
  awayValue: number;
  formatValue?: (value: number) => string;
}) => {
  const homeWidth = getDominanceBarWidth(homeValue, awayValue);

  return (
    <div>
      <div className="mb-2 flex justify-between text-body-sm text-on-surface">
        <span className="font-bold text-primary">{formatValue(homeValue)}</span>
        <span className="text-label-caps text-on-surface-variant">{label}</span>
        <span className="text-on-surface-variant opacity-70">{formatValue(awayValue)}</span>
      </div>
      <div className="flex h-1 w-full overflow-hidden rounded-full bg-surface-variant">
        <div className="h-full bg-primary" style={{ width: `${homeWidth}%` }} />
        <div className="h-full flex-1 bg-surface-container-highest" />
      </div>
    </div>
  );
};

export const MatchDominancePanel = ({ match, events }: MatchDominancePanelProps) => {
  const stats = buildMatchSideStats(match, events);

  return (
    <div className="flex flex-col gap-card-gap lg:col-span-4">
      <div className="flex-1 rounded-lg border border-outline-variant bg-surface-container p-6">
        <h3 className="mb-6 flex items-center gap-2 text-headline-sm text-on-surface">
          <MaterialIcon name="bar_chart" className="text-on-surface-variant" />
          Match Dominance
        </h3>

        {!match.isPlayed ? (
          <p className="py-8 text-center text-body-sm text-on-surface-variant">
            Stats will appear after the match is played.
          </p>
        ) : (
          <div className="space-y-6">
            <DominanceStatRow
              label="Goals"
              homeValue={stats.home.goals}
              awayValue={stats.away.goals}
            />
            <DominanceStatRow
              label="Yellow Cards"
              homeValue={stats.home.yellowCards}
              awayValue={stats.away.yellowCards}
            />
            <DominanceStatRow
              label="Red Cards"
              homeValue={stats.home.redCards}
              awayValue={stats.away.redCards}
            />
            <DominanceStatRow
              label="Injuries"
              homeValue={stats.home.injuries}
              awayValue={stats.away.injuries}
            />
          </div>
        )}

        <div className="group relative mt-8 flex h-48 cursor-default flex-col items-center justify-center overflow-hidden rounded border border-outline-variant bg-surface-dim opacity-60 transition-opacity hover:opacity-100">
          <div className="absolute inset-4 rounded-sm border border-outline-variant/30" />
          <div className="absolute inset-y-4 left-1/2 w-px bg-outline-variant/30" />
          <div className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-outline-variant/30" />
          <MaterialIcon
            name="stadium"
            className="text-on-surface-variant transition-colors group-hover:text-primary"
          />
          <span className="mt-2 text-label-caps text-on-surface-variant">
            View Heatmaps
          </span>
        </div>
      </div>
    </div>
  );
};
