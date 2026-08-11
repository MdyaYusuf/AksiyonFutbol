import { parseApiDate } from "../../../core/utils/dateTime";
import type { MatchPreview } from "../matchTypes";
import { getMatchPresentationPhase } from "./matchLiveHelpers";

export const getNextMatch = (
  matches: MatchPreview[],
  now: Date = new Date(),
): MatchPreview | undefined => {
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
