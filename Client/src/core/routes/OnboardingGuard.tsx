import { Navigate, Outlet } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../../features/clubPresidents/clubPresidentsApiSlice";
import {
  useCheckCurrentUserHasClubQuery,
  useGetCurrentUserClubQuery,
} from "../../features/clubs/clubsApiSlice";
import { ClubLifecycleStatus } from "../../features/clubs/clubTypes";
import {
  ONBOARDING_CLUB_PATH,
  ONBOARDING_DRAFT_PATH,
  ONBOARDING_PRESIDENT_PATH,
} from "./onboardingPaths";

export const OnboardingGuard = () => {
  const {
    data: hasPresident,
    isLoading: isPresidentLoading,
  } = useCheckCurrentUserHasPresidentQuery();

  const {
    data: hasClub,
    isLoading: isClubLoading,
  } = useCheckCurrentUserHasClubQuery(undefined, {
    skip: hasPresident !== true,
  });

  const {
    data: club,
    isLoading: isClubDetailLoading,
  } = useGetCurrentUserClubQuery(undefined, {
    skip: hasClub !== true,
  });

  if (isPresidentLoading || isClubLoading || isClubDetailLoading) {
    return <div>Oyun profiliniz hazırlanıyor...</div>;
  }

  if (!hasPresident) {
    return <Navigate to={ONBOARDING_PRESIDENT_PATH} replace />;
  }

  if (!hasClub) {
    return <Navigate to={ONBOARDING_CLUB_PATH} replace />;
  }

  if (club?.lifecycleStatus === ClubLifecycleStatus.Drafting) {
    return <Navigate to={ONBOARDING_DRAFT_PATH} replace />;
  }

  return <Outlet />;
};
