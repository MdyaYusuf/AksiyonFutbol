import type { ClubResponse } from "../../clubs/clubTypes";
import { getClubDisplayName } from "../../clubs/utils/clubDisplayName";
import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";
import type { MatchResponse } from "../../matches/matchTypes";
import { parseApiDate } from "../../../core/utils/dateTime";

export { getGroupDisplayLabel } from "../../leagueDivisions/utils/adminLeagueDivisionsHelpers";

export type DivisionHealthStatus = "healthy" | "pending" | "alert";
export type ActivityType = "match-created" | "club-created" | "match-played";

export interface AdminDashboardStats {
  totalDivisions: number;
  totalClubs: number;
  humanClubs: number;
  botClubs: number;
  unplayedFixtures: number;
  currentMatchWeekLabel: string;
}

export interface DivisionGlanceRow {
  id: number;
  name: string;
  tier: number;
  groupNumber: number;
  currentMatchWeek: number;
  totalClubs: number;
  humanClubs: number;
  botClubs: number;
  unplayedThisWeek: number;
  status: DivisionHealthStatus;
  statusLabel: string;
}

export interface RecentActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  sortDate: Date;
}

const getDivisionStatus = (
  unplayedThisWeek: number,
  botClubs: number,
): { status: DivisionHealthStatus; statusLabel: string } => {
  if (unplayedThisWeek === 0) {
    return { status: "healthy", statusLabel: "Healthy" };
  }

  if (botClubs > 0 && unplayedThisWeek >= 6) {
    return { status: "alert", statusLabel: "Bot Stalled" };
  }

  return { status: "pending", statusLabel: "Pending" };
};

export const buildAdminDashboardStats = (
  divisions: LeagueDivisionResponse[],
  clubs: ClubResponse[],
  matches: MatchResponse[],
): AdminDashboardStats => {
  const humanClubs = clubs.filter((club) => !club.isBot).length;
  const botClubs = clubs.filter((club) => club.isBot).length;
  const unplayedFixtures = matches.filter((match) => {
    if (match.isPlayed) {
      return false;
    }

    const division = divisions.find((item) => item.id === match.divisionId);
    return division != null && match.season === division.currentSeason;
  }).length;

  let currentMatchWeekLabel = "—";

  if (divisions.length > 0) {
    const topDivision = divisions.reduce((best, division) =>
      division.tier < best.tier ? division : best,
    );
    currentMatchWeekLabel = `Week ${topDivision.currentMatchWeek}`;
  }

  return {
    totalDivisions: divisions.length,
    totalClubs: clubs.length,
    humanClubs,
    botClubs,
    unplayedFixtures,
    currentMatchWeekLabel,
  };
};

export const buildDivisionGlanceRows = (
  divisions: LeagueDivisionResponse[],
  clubs: ClubResponse[],
  matches: MatchResponse[],
): DivisionGlanceRow[] => {
  return [...divisions]
    .sort((left, right) => {
      if (left.tier !== right.tier) {
        return left.tier - right.tier;
      }

      return left.groupNumber - right.groupNumber;
    })
    .map((division) => {
      const divisionClubs = clubs.filter((club) => club.divisionId === division.id);
      const humanClubs = divisionClubs.filter((club) => !club.isBot).length;
      const botClubs = divisionClubs.filter((club) => club.isBot).length;
      const unplayedThisWeek = matches.filter(
        (match) =>
          match.divisionId === division.id &&
          match.season === division.currentSeason &&
          match.matchWeek === division.currentMatchWeek &&
          !match.isPlayed,
      ).length;
      const { status, statusLabel } = getDivisionStatus(unplayedThisWeek, botClubs);

      return {
        id: division.id,
        name: division.name,
        tier: division.tier,
        groupNumber: division.groupNumber,
        currentMatchWeek: division.currentMatchWeek,
        totalClubs: divisionClubs.length,
        humanClubs,
        botClubs,
        unplayedThisWeek,
        status,
        statusLabel,
      };
    });
};

export const buildRecentActivity = (
  clubs: ClubResponse[],
  matches: MatchResponse[],
): RecentActivityItem[] => {
  const activities: RecentActivityItem[] = [];

  for (const club of clubs) {
    activities.push({
      id: `club-${club.id}`,
      type: "club-created",
      title: `New Club Founded: ${getClubDisplayName(club)}`,
      subtitle: club.isBot ? "Bot club • Admin" : `Human club • ${club.presidentName ?? "No president"}`,
      sortDate: parseApiDate(club.createdDate),
    });
  }

  for (const match of matches) {
    if (match.isPlayed) {
      activities.push({
        id: `match-played-${match.id}`,
        type: "match-played",
        title: `Match Played: ${match.homeClubName} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.awayClubName}`,
        subtitle: `${match.divisionName} • Week ${match.matchWeek}`,
        sortDate: parseApiDate(match.matchDate),
      });
      continue;
    }

    activities.push({
      id: `match-created-${match.id}`,
      type: "match-created",
      title: `Match Scheduled: ${match.homeClubName} vs ${match.awayClubName}`,
      subtitle: `${match.divisionName} • Week ${match.matchWeek}`,
      sortDate: parseApiDate(match.createdDate),
    });
  }

  return activities
    .sort((left, right) => right.sortDate.getTime() - left.sortDate.getTime())
    .slice(0, 8);
};

export const formatRelativeTime = (date: Date): string => {
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 0) {
    return "Just now";
  }

  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export const findAdvanceMatchWeekTarget = (
  rows: DivisionGlanceRow[],
): DivisionGlanceRow | undefined => {
  const withUnplayed = rows.filter((row) => row.unplayedThisWeek > 0);

  if (withUnplayed.length === 0) {
    return rows[0];
  }

  return withUnplayed.reduce((best, row) => (row.tier < best.tier ? row : best));
};
