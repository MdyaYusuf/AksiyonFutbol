import type { MatchPreview } from "../../matches/matchTypes";
import { getMatchResultLetter } from "../../dashboard/utils/matchHelpers";
import { parseApiDate } from "../../../core/utils/dateTime";
import type {
  PresidentAttributeKey,
  PresidentAttributes,
} from "../clubPresidentTypes";

export const PRESIDENT_ATTRIBUTE_MIN = 1;
export const PRESIDENT_ATTRIBUTE_MAX = 5;
export const PRESIDENT_ATTRIBUTE_POINT_BUDGET = 8;

export const PRESIDENT_ATTRIBUTE_KEYS: PresidentAttributeKey[] = [
  "charisma",
  "authority",
  "integrity",
  "cunning",
  "connections",
];

export const PRESIDENT_ATTRIBUTE_LABELS: Record<PresidentAttributeKey, string> = {
  charisma: "Charisma",
  authority: "Authority",
  integrity: "Integrity",
  cunning: "Cunning",
  connections: "Connections",
};

export const createBasePresidentAttributes = (): PresidentAttributes => ({
  charisma: PRESIDENT_ATTRIBUTE_MIN,
  authority: PRESIDENT_ATTRIBUTE_MIN,
  integrity: PRESIDENT_ATTRIBUTE_MIN,
  cunning: PRESIDENT_ATTRIBUTE_MIN,
  connections: PRESIDENT_ATTRIBUTE_MIN,
});

export const getSpentAttributePoints = (attributes: PresidentAttributes): number => {
  return PRESIDENT_ATTRIBUTE_KEYS.reduce((sum, key) => {
    return sum + (attributes[key] - PRESIDENT_ATTRIBUTE_MIN);
  }, 0);
};

export const getRemainingAttributePoints = (
  attributes: PresidentAttributes,
): number => {
  return PRESIDENT_ATTRIBUTE_POINT_BUDGET - getSpentAttributePoints(attributes);
};

export const formatMemberSince = (createdDate: string): string => {
  return parseApiDate(createdDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatCareerPeriod = (createdDate: string): string => {
  const startYear = parseApiDate(createdDate).getFullYear();
  return `${startYear} - Present`;
};

/** Legitimacy XP display derived from reputationPoints storage. */
export const getLegitimacyXp = (reputationPoints: number): number => {
  return reputationPoints * 100;
};

/** @deprecated Prefer getLegitimacyXp — ReputationPoints is Legitimacy storage. */
export const getReputationXp = getLegitimacyXp;

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
