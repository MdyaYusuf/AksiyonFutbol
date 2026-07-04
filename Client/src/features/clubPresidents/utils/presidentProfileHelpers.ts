import type { MatchPreview } from "../../matches/matchTypes";
import { getMatchResultLetter } from "../../dashboard/utils/matchHelpers";

export const formatMemberSince = (createdDate: string): string => {
  return new Date(createdDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatCareerPeriod = (createdDate: string): string => {
  const startYear = new Date(createdDate).getFullYear();
  return `${startYear} - Present`;
};

export const getReputationXp = (reputationPoints: number): number => {
  return reputationPoints * 100;
};

export const getWinRate = (
  matches: MatchPreview[],
  clubId: string,
): number | null => {
  const playedMatches = matches.filter(
    (match) =>
      match.isPlayed && match.homeScore != null && match.awayScore != null,
  );

  if (playedMatches.length === 0) {
    return null;
  }

  const wins = playedMatches.filter(
    (match) => getMatchResultLetter(match, clubId) === "W",
  ).length;

  return (wins / playedMatches.length) * 100;
};

export const getPlayedMatchCount = (matches: MatchPreview[]): number => {
  return matches.filter(
    (match) =>
      match.isPlayed && match.homeScore != null && match.awayScore != null,
  ).length;
};
