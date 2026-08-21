import type { ClubPreview } from "../../clubs/clubTypes";
import { getClubDisplayName } from "../../clubs/utils/clubDisplayName";
import type { MatchResponse } from "../../matches/matchTypes";
import { parseApiDate } from "../../../core/utils/dateTime";

export type StandingZone = "champions" | "europa" | "relegation" | null;
export type FormResult = "W" | "D" | "L";

export interface StandingRow {
  position: number;
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: FormResult[];
  zone: StandingZone;
}

type MatchLike = Pick<
  MatchResponse,
  | "homeClubId"
  | "awayClubId"
  | "homeScore"
  | "awayScore"
  | "isPlayed"
  | "matchWeek"
  | "matchDate"
  | "divisionId"
  | "season"
>;

interface ClubStats {
  clubId: string;
  clubName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  results: { date: string; result: FormResult }[];
}

const createEmptyStats = (club: ClubPreview): ClubStats => ({
  clubId: club.id,
  clubName: getClubDisplayName(club),
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  results: [],
});

const applyMatchResult = (
  stats: ClubStats,
  goalsFor: number,
  goalsAgainst: number,
  matchDate: string,
) => {
  stats.played += 1;
  stats.goalsFor += goalsFor;
  stats.goalsAgainst += goalsAgainst;

  if (goalsFor > goalsAgainst) {
    stats.won += 1;
    stats.results.push({ date: matchDate, result: "W" });
    return;
  }

  if (goalsFor < goalsAgainst) {
    stats.lost += 1;
    stats.results.push({ date: matchDate, result: "L" });
    return;
  }

  stats.drawn += 1;
  stats.results.push({ date: matchDate, result: "D" });
};

export const getStandingZone = (
  position: number,
  totalClubs: number,
): StandingZone => {
  if (position <= 2) {
    return "champions";
  }

  if (position <= 4 && totalClubs > 4) {
    return "europa";
  }

  if (totalClubs >= 6 && position > totalClubs - 3) {
    return "relegation";
  }

  if (totalClubs < 6 && position === totalClubs) {
    return "relegation";
  }

  return null;
};

export const buildStandings = (
  clubs: ClubPreview[],
  matches: MatchLike[],
  divisionId: number,
  upToMatchWeek: number,
  season?: number,
): StandingRow[] => {
  const statsByClubId = new Map<string, ClubStats>();

  for (const club of clubs) {
    statsByClubId.set(club.id, createEmptyStats(club));
  }

  const relevantMatches = matches.filter(
    (match) =>
      match.divisionId === divisionId &&
      (season == null || match.season === season) &&
      match.isPlayed &&
      match.matchWeek <= upToMatchWeek &&
      match.homeScore != null &&
      match.awayScore != null,
  );

  for (const match of relevantMatches) {
    const homeStats = statsByClubId.get(match.homeClubId);
    const awayStats = statsByClubId.get(match.awayClubId);

    if (homeStats) {
      applyMatchResult(
        homeStats,
        match.homeScore!,
        match.awayScore!,
        match.matchDate,
      );
    }

    if (awayStats) {
      applyMatchResult(
        awayStats,
        match.awayScore!,
        match.homeScore!,
        match.matchDate,
      );
    }
  }

  const getPoints = (stats: ClubStats): number => stats.won * 3 + stats.drawn;
  const getGoalDifference = (stats: ClubStats): number =>
    stats.goalsFor - stats.goalsAgainst;

  const getHeadToHeadPoints = (
    club: ClubStats,
    tiedGroup: ClubStats[],
  ): number => {
    if (tiedGroup.length <= 1) {
      return 0;
    }

    const groupIds = new Set(tiedGroup.map((stats) => stats.clubId));
    let points = 0;

    for (const match of relevantMatches) {
      if (
        !groupIds.has(match.homeClubId) ||
        !groupIds.has(match.awayClubId)
      ) {
        continue;
      }

      if (
        match.homeClubId !== club.clubId &&
        match.awayClubId !== club.clubId
      ) {
        continue;
      }

      const goalsFor =
        match.homeClubId === club.clubId
          ? match.homeScore!
          : match.awayScore!;
      const goalsAgainst =
        match.homeClubId === club.clubId
          ? match.awayScore!
          : match.homeScore!;

      if (goalsFor > goalsAgainst) {
        points += 3;
      } else if (goalsFor === goalsAgainst) {
        points += 1;
      }
    }

    return points;
  };

  const byPoints = new Map<number, ClubStats[]>();

  for (const stats of statsByClubId.values()) {
    const points = getPoints(stats);
    const group = byPoints.get(points);

    if (group) {
      group.push(stats);
    } else {
      byPoints.set(points, [stats]);
    }
  }

  const sorted: ClubStats[] = [];

  for (const points of [...byPoints.keys()].sort((a, b) => b - a)) {
    const tied = byPoints.get(points)!;
    tied.sort((left, right) => {
      const h2hDiff =
        getHeadToHeadPoints(right, tied) - getHeadToHeadPoints(left, tied);

      if (h2hDiff !== 0) {
        return h2hDiff;
      }

      const gdDiff = getGoalDifference(right) - getGoalDifference(left);

      if (gdDiff !== 0) {
        return gdDiff;
      }

      if (right.goalsFor !== left.goalsFor) {
        return right.goalsFor - left.goalsFor;
      }

      return left.clubName.localeCompare(right.clubName);
    });

    sorted.push(...tied);
  }

  return sorted.map((stats, index) => {
    const position = index + 1;
    const goalDifference = getGoalDifference(stats);
    const points = getPoints(stats);
    const form = [...stats.results]
      .sort(
        (left, right) =>
          parseApiDate(right.date).getTime() - parseApiDate(left.date).getTime(),
      )
      .slice(0, 5)
      .map((entry) => entry.result)
      .reverse();

    return {
      position,
      clubId: stats.clubId,
      clubName: stats.clubName,
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      goalsFor: stats.goalsFor,
      goalsAgainst: stats.goalsAgainst,
      goalDifference,
      points,
      form,
      zone: getStandingZone(position, sorted.length),
    };
  });
};

export const formatGoalDifference = (goalDifference: number): string => {
  if (goalDifference > 0) {
    return `+${goalDifference}`;
  }

  return `${goalDifference}`;
};

export const getZoneDotClassName = (zone: StandingZone): string => {
  if (zone === "champions") {
    return "bg-primary-container";
  }

  if (zone === "europa") {
    return "bg-secondary";
  }

  if (zone === "relegation") {
    return "bg-error";
  }

  return "bg-transparent";
};

export const getFormBadgeClassName = (result: FormResult): string => {
  if (result === "W") {
    return "border-primary-container/30 bg-primary-container/20 text-primary-container";
  }

  if (result === "L") {
    return "border-error/30 bg-error/20 text-error";
  }

  return "border-outline-variant bg-surface-variant text-on-surface";
};

export const exportStandingsCsv = (
  standings: StandingRow[],
  divisionName: string,
  matchWeek: number,
) => {
  const header = ["Pos", "Club", "Pld", "W", "D", "L", "GF", "GA", "GD", "Pts"];
  const rows = standings.map((row) => [
    row.position,
    `"${row.clubName.replaceAll('"', '""')}"`,
    row.played,
    row.won,
    row.drawn,
    row.lost,
    row.goalsFor,
    row.goalsAgainst,
    row.goalDifference,
    row.points,
  ]);

  const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = divisionName.replaceAll(/[^\w-]+/g, "_");

  link.href = url;
  link.download = `${safeName}_MW${matchWeek}_standings.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
