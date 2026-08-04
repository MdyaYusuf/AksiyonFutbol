import type { MatchPreview } from "../../matches/matchTypes";
import { parseApiDate } from "../../../core/utils/dateTime";
import { getMatchPresentationPhase } from "../../matches/utils/matchLiveHelpers";

export const getNextMatch = (matches: MatchPreview[]): MatchPreview | undefined => {
  const now = new Date();

  const byKickoffAsc = (left: MatchPreview, right: MatchPreview) =>
    parseApiDate(left.matchDate).getTime() - parseApiDate(right.matchDate).getTime();

  const liveOrWaiting = [...matches]
    .filter((match) => {
      const phase = getMatchPresentationPhase(match, now);
      return phase === "live" || phase === "waitingSim";
    })
    .sort(byKickoffAsc)[0];

  if (liveOrWaiting) {
    return liveOrWaiting;
  }

  return [...matches]
    .filter((match) => !match.isPlayed)
    .sort(byKickoffAsc)[0];
};

export const getRecentMatches = (
  matches: MatchPreview[],
  limit = 4,
): MatchPreview[] => {
  return [...matches]
    .filter((match) => match.isPlayed)
    .sort(
      (left, right) =>
        parseApiDate(right.matchDate).getTime() - parseApiDate(left.matchDate).getTime(),
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
