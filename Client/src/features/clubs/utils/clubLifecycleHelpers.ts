import { ClubLifecycleStatus, LeagueTier } from "../clubTypes";

export const TUTORIAL_MATCH_WEEKS = 6;

export const getLeagueTierLabel = (tier: LeagueTier): string => {
  if (tier === LeagueTier.Gold) {
    return "Gold";
  }

  if (tier === LeagueTier.Silver) {
    return "Silver";
  }

  if (tier === LeagueTier.Bronze) {
    return "Bronze";
  }

  return "Iron";
};

export const getPlacementQueueMessage = (
  tier?: LeagueTier | null,
): string => {
  if (tier == null) {
    return "Queued for seating — seats Monday 19:00";
  }

  return `Queued for ${getLeagueTierLabel(tier)} — seats Monday 19:00`;
};

export const getTutorialWeekBanner = (currentMatchWeek: number): string => {
  const week = Math.min(Math.max(1, currentMatchWeek), TUTORIAL_MATCH_WEEKS);
  return `Placement MW ${week}/${TUTORIAL_MATCH_WEEKS}`;
};

export const isDraftingClub = (
  lifecycleStatus?: ClubLifecycleStatus | null,
): boolean => {
  return lifecycleStatus === ClubLifecycleStatus.Drafting;
};
