import type { LeagueDivisionResponse } from "@/features/leagueDivisions/leagueDivisionTypes";
import { parseApiDate } from "@/core/utils/dateTime";
import type { MatchResponse } from "@/features/matches/matchTypes";

export type MatchStatusFilter = "all" | "scheduled" | "played";

export interface UnplayedWeekAlert {
  divisionId: number;
  divisionName: string;
  matchWeek: number;
  unplayedCount: number;
}

export const formatAdminMatchDateTime = (matchDate: string): string => {
  const date = parseApiDate(matchDate);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const toDateTimeLocalValue = (matchDate: string): string => {
  const date = parseApiDate(matchDate);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromDateTimeLocalValue = (value: string): string => {
  if (!value) {
    return new Date().toISOString();
  }

  // datetime-local is wall-clock local time; convert to UTC ISO for the API.
  return new Date(value).toISOString();
};

export const getDefaultMatchDateLocal = (): string => {
  const date = new Date();
  date.setMinutes(0, 0, 0);
  date.setHours(date.getHours() + 1);
  return toDateTimeLocalValue(date.toISOString());
};

export const filterAdminMatches = (
  matches: MatchResponse[],
  searchQuery: string,
  divisionId: number | "all",
  matchWeek: number | "all",
  statusFilter: MatchStatusFilter,
): MatchResponse[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return matches
    .filter((match) => {
      if (divisionId !== "all" && match.divisionId !== divisionId) {
        return false;
      }

      if (matchWeek !== "all" && match.matchWeek !== matchWeek) {
        return false;
      }

      if (statusFilter === "scheduled" && match.isPlayed) {
        return false;
      }

      if (statusFilter === "played" && !match.isPlayed) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        match.homeClubName.toLowerCase().includes(normalizedQuery) ||
        match.awayClubName.toLowerCase().includes(normalizedQuery) ||
        match.divisionName.toLowerCase().includes(normalizedQuery) ||
        (match.refereeName?.toLowerCase().includes(normalizedQuery) ?? false)
      );
    })
    .sort((left, right) => {
      if (left.matchWeek !== right.matchWeek) {
        return left.matchWeek - right.matchWeek;
      }

      return parseApiDate(left.matchDate).getTime() - parseApiDate(right.matchDate).getTime();
    });
};

export const getAvailableMatchWeeks = (matches: MatchResponse[]): number[] => {
  return [...new Set(matches.map((match) => match.matchWeek))].sort((a, b) => a - b);
};

export const findUnplayedWeekAlert = (
  matches: MatchResponse[],
  divisions: LeagueDivisionResponse[],
): UnplayedWeekAlert | null => {
  const counts = new Map<string, UnplayedWeekAlert>();

  for (const match of matches) {
    if (match.isPlayed) {
      continue;
    }

    const division = divisions.find((item) => item.id === match.divisionId);

    if (division == null || match.season !== division.currentSeason) {
      continue;
    }

    const key = `${match.divisionId}:${match.matchWeek}`;
    const existing = counts.get(key);

    if (existing) {
      existing.unplayedCount += 1;
      continue;
    }

    counts.set(key, {
      divisionId: match.divisionId,
      divisionName: match.divisionName,
      matchWeek: match.matchWeek,
      unplayedCount: 1,
    });
  }

  const alerts = [...counts.values()];

  if (alerts.length === 0) {
    return null;
  }

  const currentWeekAlerts = alerts.filter((alert) => {
    const division = divisions.find((item) => item.id === alert.divisionId);
    return division?.currentMatchWeek === alert.matchWeek;
  });

  const candidates = currentWeekAlerts.length > 0 ? currentWeekAlerts : alerts;

  return candidates.reduce((best, alert) =>
    alert.unplayedCount > best.unplayedCount ? alert : best,
  );
};

export const getUnplayedMatchesForWeek = (
  matches: MatchResponse[],
  divisionId: number,
  matchWeek: number,
  season?: number,
): MatchResponse[] => {
  return matches.filter(
    (match) =>
      !match.isPlayed &&
      match.divisionId === divisionId &&
      match.matchWeek === matchWeek &&
      (season == null || match.season === season),
  );
};

export const formatDivisionOption = (division: LeagueDivisionResponse): string => {
  return `${division.name} (Tier ${division.tier})`;
};
