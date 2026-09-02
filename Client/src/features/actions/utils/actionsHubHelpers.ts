import type { ClubActionAvailability, ClubActionCategory } from "@/features/actions/actionTypes";
import { ClubActionCategory as Category, ClubActionType } from "@/features/actions/actionTypes";
import { getPresidentAttributeBarClass } from "@/features/clubPresidents/utils/presidentAttributePresentation";
import type { PresidentAttributeKey } from "@/features/clubPresidents/clubPresidentTypes";

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

export const getCategorySectionTitle = (category: ClubActionCategory): string => {
  if (category === Category.Match) {
    return "Match Operations";
  }

  if (category === Category.Squad) {
    return "Squad Management";
  }

  return "Political Operations";
};

export const getCategoryGridClass = (_category: ClubActionCategory): string => {
  return "grid grid-cols-1 gap-card-gap xl:grid-cols-2";
};

export const formatCooldownDisplay = (
  cooldownDays: number,
  cooldownRemainingDays: number,
): string => {
  if (cooldownDays <= 0) {
    return "None";
  }

  if (cooldownRemainingDays > 0) {
    return `${cooldownRemainingDays}d left`;
  }

  if (cooldownDays >= 7 && cooldownDays % 7 === 0) {
    return `${cooldownDays / 7} Wk`;
  }

  return `${cooldownDays}d`;
};

export const getHeatDescription = (value: number, max: number): string => {
  if (max <= 0) {
    return "Scrutiny from gray-area moves. Higher heat raises the chance of exposure.";
  }

  const ratio = value / max;

  if (ratio >= 0.67) {
    return "Federation scrutiny is critical. Further gray-area moves carry a high risk of detection and sanctions.";
  }

  if (ratio >= 0.34) {
    return "Scrutiny is elevated. Investigators are watching — bold moves will draw attention quickly.";
  }

  return "Current heat is manageable. Federation scrutiny is low, but bold gray-area moves will increase investigative attention quickly.";
};

/** President attribute bars — colors shared with action requirement chips. */
export const getAttributeBarFillClass = (key: PresidentAttributeKey): string => {
  return getPresidentAttributeBarClass(key);
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
    case ClubActionType.EspionageII:
      return "travel_explore";
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
    case ClubActionType.TapUpTargetII:
      return "person_add";
    case ClubActionType.CommunityDay:
      return "festival";
    case ClubActionType.AcademyPush:
      return "school";
    case ClubActionType.FairPlayPledge:
      return "verified_user";
    case ClubActionType.CleanMediaCampaign:
      return "campaign";
    case ClubActionType.FederationAlly:
      return "handshake";
    default:
      return "bolt";
  }
};

export const groupActionsByCategory = (
  actions: ClubActionAvailability[],
): { category: ClubActionCategory; actions: ClubActionAvailability[] }[] => {
  const order: ClubActionCategory[] = [Category.Match, Category.Politics, Category.Squad];

  return order.map((category) => ({
    category,
    actions: actions.filter((action) => action.category === category),
  }));
};
