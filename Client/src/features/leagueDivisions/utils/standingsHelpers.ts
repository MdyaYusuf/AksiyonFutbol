import type { ClubPreview } from "@/features/clubs/clubTypes";
import { LeagueTier } from "@/features/clubs/clubTypes";
import { getClubDisplayName } from "@/features/clubs/utils/clubDisplayName";
import { TUTORIAL_MATCH_WEEKS } from "@/features/clubs/utils/clubLifecycleHelpers";
import type { MatchResponse } from "@/features/matches/matchTypes";
import { parseApiDate } from "@/core/utils/dateTime";

/** Mirrors Api GameOptions.PromotionSlots / RelegationSlots defaults. */
export const PROMOTION_SLOTS = 2;
export const RELEGATION_SLOTS = 2;

/** Mirrors Api GameOptions graduation point bands for placement league seating. */
export const GRADUATION_POINT_BANDS: {
  zone: StandingZone;
  label: string;
  minPoints: number;
  maxPoints: number;
  tier: LeagueTier;
}[] = [
  {
    zone: "placement-gold",
    label: "Gold Placement",
    minPoints: 15,
    maxPoints: 18,
    tier: LeagueTier.Gold,
  },
  {
    zone: "placement-silver",
    label: "Silver Placement",
    minPoints: 10,
    maxPoints: 14,
    tier: LeagueTier.Silver,
  },
  {
    zone: "placement-bronze",
    label: "Bronze Placement",
    minPoints: 5,
    maxPoints: 9,
    tier: LeagueTier.Bronze,
  },
  {
    zone: "placement-iron",
    label: "Iron Placement",
    minPoints: 0,
    maxPoints: 4,
    tier: LeagueTier.Iron,
  },
];

export type StandingZone =
  | "promotion"
  | "relegation"
  | "placement-gold"
  | "placement-silver"
  | "placement-bronze"
  | "placement-iron"
  | null;

export type FormResult = "W" | "D" | "L";

export interface StandingMatchResult {
  date: string;
  result: FormResult;
  matchWeek: number;
  opponentName: string;
  goalsFor: number;
  goalsAgainst: number;
  isHome: boolean;
}

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
  matchResults: StandingMatchResult[];
  zone: StandingZone;
}

export interface BuildStandingsOptions {
  season?: number;
  isTutorial?: boolean;
  /** LeagueTier numeric value (Gold=1 … Iron=4). */
  tier?: number;
}

type MatchLike = Pick<
  MatchResponse,
  | "homeClubId"
  | "awayClubId"
  | "homeClubName"
  | "awayClubName"
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
  results: StandingMatchResult[];
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
  matchWeek: number,
  opponentName: string,
  isHome: boolean,
) => {
  stats.played += 1;
  stats.goalsFor += goalsFor;
  stats.goalsAgainst += goalsAgainst;

  let result: FormResult = "D";

  if (goalsFor > goalsAgainst) {
    stats.won += 1;
    result = "W";
  } else if (goalsFor < goalsAgainst) {
    stats.lost += 1;
    result = "L";
  } else {
    stats.drawn += 1;
  }

  stats.results.push({
    date: matchDate,
    result,
    matchWeek,
    opponentName,
    goalsFor,
    goalsAgainst,
    isHome,
  });
};

export const canPromoteFromTier = (tier?: number): boolean => {
  return tier != null && tier !== LeagueTier.Gold;
};

export const canRelegateFromTier = (tier?: number): boolean => {
  return tier != null && tier !== LeagueTier.Iron;
};

export const getCompetitiveStandingZone = (
  position: number,
  totalClubs: number,
  tier?: number,
): StandingZone => {
  if (totalClubs <= 0) {
    return null;
  }

  const promotionSlots = Math.min(PROMOTION_SLOTS, totalClubs);
  const relegationSlots = Math.min(RELEGATION_SLOTS, totalClubs);

  if (canPromoteFromTier(tier) && position <= promotionSlots) {
    return "promotion";
  }

  if (canRelegateFromTier(tier) && position > totalClubs - relegationSlots) {
    return "relegation";
  }

  return null;
};

export const getTutorialPlacementZone = (points: number): StandingZone => {
  for (const band of GRADUATION_POINT_BANDS) {
    if (points >= band.minPoints && points <= band.maxPoints) {
      return band.zone;
    }
  }

  if (points > GRADUATION_POINT_BANDS[0].maxPoints) {
    return "placement-gold";
  }

  return "placement-iron";
};

export const getStandingZone = (
  position: number,
  totalClubs: number,
  points: number,
  options?: BuildStandingsOptions,
): StandingZone => {
  if (options?.isTutorial) {
    return getTutorialPlacementZone(points);
  }

  return getCompetitiveStandingZone(position, totalClubs, options?.tier);
};

export const buildStandings = (
  clubs: ClubPreview[],
  matches: MatchLike[],
  divisionId: number,
  upToMatchWeek: number,
  options?: BuildStandingsOptions,
): StandingRow[] => {
  const statsByClubId = new Map<string, ClubStats>();

  for (const club of clubs) {
    statsByClubId.set(club.id, createEmptyStats(club));
  }

  const season = options?.season;
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
        match.matchWeek,
        match.awayClubName,
        true,
      );
    }

    if (awayStats) {
      applyMatchResult(
        awayStats,
        match.awayScore!,
        match.homeScore!,
        match.matchDate,
        match.matchWeek,
        match.homeClubName,
        false,
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
    const matchResults = [...stats.results].sort(
      (left, right) =>
        parseApiDate(left.date).getTime() - parseApiDate(right.date).getTime(),
    );
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
      matchResults,
      zone: getStandingZone(position, sorted.length, points, options),
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
  if (zone === "placement-gold") {
    return "bg-secondary";
  }

  if (zone === "placement-silver") {
    return "bg-sky-400";
  }

  if (zone === "placement-bronze") {
    return "bg-tertiary";
  }

  if (zone === "placement-iron") {
    return "bg-violet-400";
  }

  if (zone === "promotion") {
    return "bg-primary-container";
  }

  if (zone === "relegation") {
    return "bg-error";
  }

  return "bg-transparent";
};

export const filterStandingResultsByOutcome = (
  results: StandingMatchResult[],
  outcome: FormResult,
): StandingMatchResult[] => {
  return results.filter((result) => result.result === outcome);
};

export const formatStandingResultScore = (result: StandingMatchResult): string => {
  return `${result.goalsFor}-${result.goalsAgainst}`;
};

export const formatStandingResultOpponent = (result: StandingMatchResult): string => {
  const venue = result.isHome ? "Home" : "Away";
  return `${venue} vs ${result.opponentName}`;
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

/** Same gray chip look as the Draw (D) form badge. */
export const MATCH_WEEK_BADGE_CLASS_NAME =
  "border-outline-variant bg-surface-variant text-on-surface";

export const getVenueBadgeClassName = (isHome: boolean): string => {
  if (isHome) {
    return "border-sky-400/40 bg-sky-400/15 text-sky-400";
  }

  return "border-violet-400/40 bg-violet-400/15 text-violet-400";
};

export interface OutcomePopoverTheme {
  panelBorder: string;
  header: string;
  headerTitle: string;
  scoreBadge: string;
  rowHover: string;
}

export const getOutcomePopoverTheme = (outcome: FormResult): OutcomePopoverTheme => {
  if (outcome === "W") {
    return {
      panelBorder: "border-primary/30",
      header: "border-b border-primary/20 bg-primary/10",
      headerTitle: "text-primary",
      scoreBadge: "border-primary/30 bg-primary/20 text-primary font-bold",
      rowHover: "hover:bg-primary/10",
    };
  }

  if (outcome === "L") {
    return {
      panelBorder: "border-error/30",
      header: "border-b border-error/20 bg-error/10",
      headerTitle: "text-error",
      scoreBadge: "border-error/30 bg-error/20 text-error font-bold",
      rowHover: "hover:bg-error/10",
    };
  }

  return {
    panelBorder: "border-secondary/30",
    header: "border-b border-secondary/20 bg-secondary/10",
    headerTitle: "text-secondary",
    scoreBadge: "border-secondary/30 bg-secondary/20 text-secondary font-bold",
    rowHover: "hover:bg-secondary/10",
  };
};

export interface StandingsLegendItem {
  zone: StandingZone;
  label: string;
}

export const getStandingsLegendItems = (
  options?: BuildStandingsOptions,
): StandingsLegendItem[] => {
  if (options?.isTutorial) {
    return GRADUATION_POINT_BANDS.map((band) => ({
      zone: band.zone,
      label: `${band.label} (${band.minPoints}–${band.maxPoints} pts)`,
    }));
  }

  const items: StandingsLegendItem[] = [];

  if (canPromoteFromTier(options?.tier)) {
    items.push({
      zone: "promotion",
      label: `Promotion (top ${PROMOTION_SLOTS})`,
    });
  }

  if (canRelegateFromTier(options?.tier)) {
    items.push({
      zone: "relegation",
      label: `Relegation (bottom ${RELEGATION_SLOTS})`,
    });
  }

  return items;
};

type MatchWeekSource = {
  divisionId: number;
  season: number;
  matchWeek: number;
};

export const resolveScheduledMaxMatchWeek = (
  matches: MatchWeekSource[],
  divisionId: number,
  season: number,
): number => {
  let max = 0;

  for (const match of matches) {
    if (match.divisionId === divisionId && match.season === season && match.matchWeek > max) {
      max = match.matchWeek;
    }
  }

  return max;
};

export const resolveLeagueDisplayMaxMatchWeek = (
  currentMatchWeek: number,
  scheduledMaxMatchWeek: number,
  isTutorial: boolean,
): number => {
  const scheduleCap =
    scheduledMaxMatchWeek > 0
      ? scheduledMaxMatchWeek
      : isTutorial
        ? TUTORIAL_MATCH_WEEKS
        : currentMatchWeek;

  return Math.max(1, Math.min(currentMatchWeek, scheduleCap));
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
