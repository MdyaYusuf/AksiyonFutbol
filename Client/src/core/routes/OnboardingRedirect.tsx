import { Navigate } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../../features/clubPresidents/clubPresidentsApiSlice";
import { useCheckCurrentUserHasClubQuery } from "../../features/clubs/clubsApiSlice";

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

  if (isPresidentLoading || isClubLoading) {
    return <div>Onboarding durumu kontrol ediliyor...</div>;
  }

  if (!hasPresident) {
    return <Navigate to="/app/onboarding/president" replace />;
  }

  if (!hasClub) {
    return <Navigate to="/app/onboarding/club" replace />;
  }

  return <Navigate to="/app/dashboard" replace />;
};
