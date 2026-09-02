import type { MatchPreview } from "@/features/matches/matchTypes";
import { getMatchResultLetter } from "@/features/dashboard/utils/matchHelpers";
import { parseApiDate } from "@/core/utils/dateTime";

export type FixtureStatusFilter = "all" | "played" | "upcoming";

export type FixtureScopeFilter = "all" | "my-team";

export interface MatchWeekGroup {
  matchWeek: number;
  matches: MatchPreview[];
  hasUpcoming: boolean;
}

export const FIXTURE_SCOPE_FILTERS: {
  value: FixtureScopeFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "my-team", label: "My Team" },
];

export const getFixtureScopeChipClassName = (
  isActive: boolean,
): string => {
  const base = "rounded border px-4 py-2 text-label-caps transition-colors";

  if (isActive) {
    return `${base} border-primary/50 bg-primary-container/10 text-primary`;
  }

  return `${base} border-outline-variant bg-transparent text-on-surface-variant hover:border-primary hover:text-primary`;
};

export const formatFixtureDateTime = (matchDate: string): string => {
  const date = parseApiDate(matchDate);

  const dayMonth = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dayMonth} · ${time}`;
};

export const filterMatchesByScope = (
  matches: MatchPreview[],
  scopeFilter: FixtureScopeFilter,
  clubId: string,
): MatchPreview[] => {
  if (scopeFilter === "my-team") {
    return matches.filter(
      (match) => match.homeClubId === clubId || match.awayClubId === clubId,
    );
  }

  return matches;
};

export const filterMatchesByStatus = (
  matches: MatchPreview[],
  statusFilter: FixtureStatusFilter,
): MatchPreview[] => {
  if (statusFilter === "played") {
    return matches.filter((match) => match.isPlayed);
  }

  if (statusFilter === "upcoming") {
    return matches.filter((match) => !match.isPlayed);
  }

  return matches;
};

export const groupMatchesByWeek = (matches: MatchPreview[]): MatchWeekGroup[] => {
  const groups = new Map<number, MatchPreview[]>();

  for (const match of matches) {
    const existing = groups.get(match.matchWeek) ?? [];
    existing.push(match);
    groups.set(match.matchWeek, existing);
  }

  return [...groups.entries()]
    .sort(([leftWeek], [rightWeek]) => leftWeek - rightWeek)
    .map(([matchWeek, weekMatches]) => {
      const sortedMatches = [...weekMatches].sort(
        (left, right) =>
          parseApiDate(left.matchDate).getTime() - parseApiDate(right.matchDate).getTime(),
      );

      return {
        matchWeek,
        matches: sortedMatches,
        hasUpcoming: sortedMatches.some((match) => !match.isPlayed),
      };
    });
};

export const getScoreBadgeClassName = (
  match: MatchPreview,
  clubId: string,
): string => {
  if (!match.isPlayed || match.homeScore == null || match.awayScore == null) {
    return "border border-outline-variant bg-surface-container-high text-on-surface-variant text-label-caps tracking-widest";
  }

  const involvesClub =
    match.homeClubId === clubId || match.awayClubId === clubId;

  if (!involvesClub) {
    return "border border-outline-variant bg-surface-container-high text-on-surface text-stat-value tracking-wider";
  }

  const result = getMatchResultLetter(match, clubId);

  if (result === "W") {
    return "border border-primary/50 bg-primary/20 text-primary text-stat-value tracking-wider";
  }

  if (result === "L") {
    return "border border-error/40 bg-error/10 text-error text-stat-value tracking-wider";
  }

  return "border border-secondary/40 bg-secondary-container/25 text-secondary-fixed text-stat-value tracking-wider";
};

export const getScoreDisplay = (match: MatchPreview): string => {
  if (!match.isPlayed || match.homeScore == null || match.awayScore == null) {
    return "VS";
  }

  return `${match.homeScore} - ${match.awayScore}`;
};
