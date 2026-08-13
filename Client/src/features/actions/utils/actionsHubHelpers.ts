import type { ClubActionAvailability, ClubActionCategory } from "../actionTypes";
import { ClubActionCategory as Category, ClubActionType } from "../actionTypes";

export const formatChancePercent = (chance: number): string => {
  return `${Math.round(chance * 100)}%`;
};

/** Heat/Suspicion: warmer red as risk rises. */
export const getHeatBarColor = (value: number, max: number): string => {
  if (max <= 0) {
    return "bg-error/40";
  }

  const ratio = value / max;

  if (ratio >= 0.67) {
    return "bg-error";
  }

  if (ratio >= 0.34) {
    return "bg-error/80";
  }

  return "bg-error/50";
};

export const getHeatLabel = (value: number, max: number): string => {
  if (max <= 0) {
    return "Clear";
  }

  const ratio = value / max;

  if (ratio >= 0.67) {
    return "Critical";
  }

  if (ratio >= 0.34) {
    return "Elevated";
  }

  return "Low";
};

export const getCategoryLabel = (category: ClubActionCategory): string => {
  if (category === Category.Match) {
    return "Match";
  }

  if (category === Category.Squad) {
    return "Squad";
  }

  return "Politics";
};

export const getCategoryIcon = (category: ClubActionCategory): string => {
  if (category === Category.Match) {
    return "sports_soccer";
  }

  if (category === Category.Squad) {
    return "groups";
  }

  return "account_balance";
};

export const getActionIcon = (actionType: number): string => {
  switch (actionType) {
    case ClubActionType.MatchFixing:
      return "handshake";
    case ClubActionType.Doping:
      return "science";
    case ClubActionType.Espionage:
      return "visibility";
    case ClubActionType.Sabotage:
      return "build";
    case ClubActionType.IntimidateReferee:
      return "campaign";
    case ClubActionType.TeamBonding:
      return "celebration";
    case ClubActionType.FinePlayer:
      return "gavel";
    case ClubActionType.MotivationalTalk:
      return "record_voice_over";
    case ClubActionType.BrutalTraining:
      return "fitness_center";
    case ClubActionType.PromiseWinBonus:
      return "payments";
    case ClubActionType.MediaSpin:
      return "newspaper";
    case ClubActionType.LobbyFederation:
      return "policy";
    case ClubActionType.DodgySponsorship:
      return "payments";
    case ClubActionType.TapUpTarget:
      return "person_search";
    default:
      return "bolt";
  }
};

export const groupActionsByCategory = (
  actions: ClubActionAvailability[],
): { category: ClubActionCategory; actions: ClubActionAvailability[] }[] => {
  const order: ClubActionCategory[] = [Category.Match, Category.Squad, Category.Politics];

  return order.map((category) => ({
    category,
    actions: actions.filter((action) => action.category === category),
  }));
};
