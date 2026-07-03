import type { MatchPreview } from "../../matches/matchTypes";

export const getNextMatch = (matches: MatchPreview[]): MatchPreview | undefined => {
  return [...matches]
    .filter((match) => !match.isPlayed)
    .sort(
      (left, right) =>
        new Date(left.matchDate).getTime() - new Date(right.matchDate).getTime(),
    )[0];
};

export const getRecentMatches = (
  matches: MatchPreview[],
  limit = 4,
): MatchPreview[] => {
  return [...matches]
    .filter((match) => match.isPlayed)
    .sort(
      (left, right) =>
        new Date(right.matchDate).getTime() - new Date(left.matchDate).getTime(),
    )
    .slice(0, limit);
};

export const getMatchResultLetter = (
  match: MatchPreview,
  clubId: string,
): "W" | "D" | "L" | null => {
  if (!match.isPlayed || match.homeScore == null || match.awayScore == null) {
    return null;
  }

  const isHome = match.homeClubId === clubId;
  const goalsFor = isHome ? match.homeScore : match.awayScore;
  const goalsAgainst = isHome ? match.awayScore : match.homeScore;

  if (goalsFor > goalsAgainst) {
    return "W";
  }
  if (goalsFor < goalsAgainst) {
    return "L";
  }
  return "D";
};

export const getOpponentLabel = (match: MatchPreview, clubId: string): string => {
  const isHome = match.homeClubId === clubId;
  const opponentName = isHome ? match.awayClubName : match.homeClubName;
  return `vs ${opponentName} (${isHome ? "H" : "A"})`;
};

export const getScoreLabel = (match: MatchPreview): string => {
  return `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`;
};
