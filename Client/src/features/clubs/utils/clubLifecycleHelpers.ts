import { ClubLifecycleStatus, LeagueTier } from "@/features/clubs/clubTypes";

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

export const getPlacementQueueTitle = (
  tier?: LeagueTier | null,
): string => {
  if (tier == null) {
    return "Placement complete — waiting for competitive seating";
  }

  return `Placement complete — queued for ${getLeagueTierLabel(tier)}`;
};

/** @deprecated Use getPlacementQueueTitle for headlines. */
export const getPlacementQueueMessage = getPlacementQueueTitle;

export const getPlacementQueueSummary = (
  tier?: LeagueTier | null,
): string => {
  const tierLabel = tier != null ? getLeagueTierLabel(tier) : "competitive";

  return `Waiting for an 8-club ${tierLabel} division. Seating runs Mondays 19:00 Istanbul or earlier when every team is ready. Bots fill open slots. Squad and cash unchanged while waiting. League has your sealed placement table until competitive fixtures appear.`;
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
