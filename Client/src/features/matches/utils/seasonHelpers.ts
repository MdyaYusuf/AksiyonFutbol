import type { LeagueDivisionResponse } from "../../leagueDivisions/leagueDivisionTypes";

interface SeasonMatchLike {
  divisionId: number;
  season: number;
}

export const isCurrentSeasonMatch = (
  match: SeasonMatchLike,
  currentSeason: number | null | undefined,
  divisionId?: number | null,
): boolean => {
  if (currentSeason == null) {
    return true;
  }

  if (divisionId != null && match.divisionId !== divisionId) {
    return false;
  }

  return match.season === currentSeason;
};

export const filterCurrentSeasonMatches = <T extends SeasonMatchLike>(
  matches: T[],
  currentSeason: number | null | undefined,
  divisionId?: number | null,
): T[] => {
  return matches.filter((match) =>
    isCurrentSeasonMatch(match, currentSeason, divisionId),
  );
};

export const isMatchInDivisionCurrentSeason = (
  match: SeasonMatchLike,
  divisions: LeagueDivisionResponse[],
): boolean => {
  const division = divisions.find((item) => item.id === match.divisionId);

  if (!division) {
    return false;
  }

  return match.season === division.currentSeason;
};
