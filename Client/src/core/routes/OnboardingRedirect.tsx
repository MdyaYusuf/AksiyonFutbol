import { Navigate } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../../features/clubPresidents/clubPresidentsApiSlice";
import {
  useCheckCurrentUserHasClubQuery,
  useGetCurrentUserClubQuery,
} from "../../features/clubs/clubsApiSlice";
import { resolveOnboardingPath } from "./onboardingPaths";

export const OnboardingRedirect = () => {
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
    return <div>Onboarding durumu kontrol ediliyor...</div>;
  }

  return (
    <Navigate
      to={resolveOnboardingPath(
        hasPresident === true,
        hasClub === true,
        club?.lifecycleStatus,
      )}
      replace
    />
  );
};
