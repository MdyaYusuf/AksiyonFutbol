import { ClubLifecycleStatus } from "@/features/clubs/clubTypes";

export const ONBOARDING_PRESIDENT_PATH = "/app/onboarding/president";
export const ONBOARDING_CLUB_PATH = "/app/onboarding/club";
export const ONBOARDING_DRAFT_PATH = "/app/onboarding/draft";
export const APP_DASHBOARD_PATH = "/app/dashboard";

export const resolveOnboardingPath = (
  hasPresident: boolean,
  hasClub: boolean,
  lifecycleStatus?: ClubLifecycleStatus | null,
): string => {
  if (!hasPresident) {
    return ONBOARDING_PRESIDENT_PATH;
  }

  if (!hasClub) {
    return ONBOARDING_CLUB_PATH;
  }

  if (lifecycleStatus === ClubLifecycleStatus.Drafting) {
    return ONBOARDING_DRAFT_PATH;
  }

  return APP_DASHBOARD_PATH;
};
