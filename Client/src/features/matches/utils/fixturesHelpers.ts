import type { MatchPreview } from "../matchTypes";
import { getMatchResultLetter } from "../../dashboard/utils/matchHelpers";

export type FixtureStatusFilter = "all" | "results" | "upcoming";

export interface MatchWeekGroup {
  matchWeek: number;
  matches: MatchPreview[];
  hasUpcoming: boolean;
}

export const formatFixtureDateTime = (matchDate: string): string => {
  const date = new Date(matchDate);

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

export const filterMatchesByStatus = (
  matches: MatchPreview[],
  statusFilter: FixtureStatusFilter,
): MatchPreview[] => {
  if (statusFilter === "results") {
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
          new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime(),
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

  const result = getMatchResultLetter(match, clubId);

  if (result === "W") {
    return "border border-primary/50 bg-primary/20 text-primary text-stat-value tracking-wider";
  }

  if (result === "L") {
    return "border border-error/40 bg-error/10 text-error text-stat-value tracking-wider";
  }

  return "bg-surface-variant text-on-surface text-stat-value tracking-wider";
};

export const getScoreDisplay = (match: MatchPreview): string => {
  if (!match.isPlayed || match.homeScore == null || match.awayScore == null) {
    return "VS";
  }

  return `${match.homeScore} - ${match.awayScore}`;
};
