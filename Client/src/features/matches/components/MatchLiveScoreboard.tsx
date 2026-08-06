interface MatchLiveScoreboardProps {
  homeClubName: string;
  awayClubName: string;
  homeScore: number;
  awayScore: number;
  matchMinute: number;
  statusLabel: string;
}

export const MatchLiveScoreboard = ({
  homeClubName,
  awayClubName,
  homeScore,
  awayScore,
  matchMinute,
  statusLabel,
}: MatchLiveScoreboardProps) => {
  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container px-3 py-2 md:px-4">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-label-caps text-on-surface-variant">{statusLabel}</span>
        <span className="font-data-mono text-data-mono text-primary">{matchMinute}&apos;</span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-body-sm font-semibold text-on-surface md:text-headline-sm">
            {homeClubName}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded border border-outline-variant bg-surface-container-high px-3 py-1 font-data-mono text-stat-value text-primary">
          <span>{homeScore}</span>
          <span className="text-on-surface-variant opacity-50">-</span>
          <span className="text-on-surface">{awayScore}</span>
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-body-sm font-semibold text-on-surface md:text-headline-sm">
            {awayClubName}
          </p>
        </div>
      </div>
    </div>
  );
};
