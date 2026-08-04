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
    <div className="rounded-lg border border-outline-variant bg-surface-container px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-label-caps text-on-surface-variant">{statusLabel}</span>
        <span className="font-data-mono text-data-mono text-primary">{matchMinute}&apos;</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-headline-sm text-on-surface">{homeClubName}</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 rounded border border-outline-variant bg-surface-container-high px-4 py-2 font-data-mono text-stat-value text-primary">
          <span>{homeScore}</span>
          <span className="text-on-surface-variant opacity-50">-</span>
          <span className="text-on-surface">{awayScore}</span>
        </div>

        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-headline-sm text-on-surface">{awayClubName}</p>
        </div>
      </div>
    </div>
  );
};
