import type { LiveMatchStats } from "../utils/matchLiveHelpers";

interface MatchLiveStatsProps {
  homeClubName: string;
  awayClubName: string;
  stats: LiveMatchStats;
}

interface StatRowProps {
  label: string;
  homeValue: number;
  awayValue: number;
  emphasize?: boolean;
  formatValue?: (value: number) => string;
}

const formatXg = (value: number): string => {
  return value.toFixed(2);
};

const StatRow = ({
  label,
  homeValue,
  awayValue,
  emphasize = false,
  formatValue,
}: StatRowProps) => {
  const total = homeValue + awayValue;
  const homeShare = total > 0 ? (homeValue / total) * 100 : 50;
  const awayShare = total > 0 ? (awayValue / total) * 100 : 50;
  const homeDisplay = formatValue ? formatValue(homeValue) : String(homeValue);
  const awayDisplay = formatValue ? formatValue(awayValue) : String(awayValue);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between gap-2 text-body-sm">
        <span
          className={`min-w-7 text-left font-data-mono text-data-mono ${
            emphasize ? "text-primary" : "text-on-surface"
          }`}
        >
          {homeDisplay}
        </span>
        <span className="text-label-caps text-on-surface-variant">{label}</span>
        <span
          className={`min-w-7 text-right font-data-mono text-data-mono ${
            emphasize ? "text-primary" : "text-on-surface"
          }`}
        >
          {awayDisplay}
        </span>
      </div>
      <div className="flex h-1 overflow-hidden rounded-full bg-surface-variant">
        <div
          className="h-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${homeShare}%` }}
        />
        <div
          className="h-full bg-on-surface-variant/40 transition-[width] duration-500 ease-out"
          style={{ width: `${awayShare}%` }}
        />
      </div>
    </div>
  );
};

export const MatchLiveStats = ({
  homeClubName,
  awayClubName,
  stats,
}: MatchLiveStatsProps) => {
  return (
    <div className="flex h-full flex-col rounded-lg border border-outline-variant bg-surface-container">
      <div className="border-b border-outline-variant px-3 py-2 text-center">
        <h3 className="text-label-caps text-on-surface-variant">Match Stats</h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-label-caps text-on-surface-variant">
          <span className="truncate text-left text-primary">{homeClubName}</span>
          <span className="truncate text-right">{awayClubName}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-evenly overflow-y-auto px-3 py-2">
        <StatRow
          label="Possession %"
          homeValue={stats.homePossessionPercent}
          awayValue={stats.awayPossessionPercent}
          emphasize
        />
        <StatRow label="Goals" homeValue={stats.home.goals} awayValue={stats.away.goals} emphasize />
        <StatRow label="Shots" homeValue={stats.home.shots} awayValue={stats.away.shots} />
        <StatRow
          label="On Target"
          homeValue={stats.home.shotsOnTarget}
          awayValue={stats.away.shotsOnTarget}
        />
        <StatRow
          label="xG"
          homeValue={stats.home.expectedGoals}
          awayValue={stats.away.expectedGoals}
          formatValue={formatXg}
          emphasize
        />
        <StatRow
          label="Big Chances"
          homeValue={stats.home.bigChances}
          awayValue={stats.away.bigChances}
        />
        <StatRow
          label="Big Chances Missed"
          homeValue={stats.home.bigChancesMissed}
          awayValue={stats.away.bigChancesMissed}
        />
        <StatRow label="Corners" homeValue={stats.home.corners} awayValue={stats.away.corners} />
        <StatRow label="Tackles" homeValue={stats.home.tackles} awayValue={stats.away.tackles} />
        <StatRow
          label="Interceptions"
          homeValue={stats.home.interceptions}
          awayValue={stats.away.interceptions}
        />
        <StatRow
          label="Clearances"
          homeValue={stats.home.clearances}
          awayValue={stats.away.clearances}
        />
        <StatRow label="Fouls" homeValue={stats.home.fouls} awayValue={stats.away.fouls} />
      </div>
    </div>
  );
};
