import { Navigate, Outlet } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../../features/clubPresidents/clubPresidentsApiSlice";
import { useCheckCurrentUserHasClubQuery } from "../../features/clubs/clubsApiSlice";

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

  if (isPresidentLoading || isClubLoading) {
    return <div>Oyun profiliniz hazırlanıyor...</div>;
  }

  if (!hasPresident) {
    return <Navigate to="/app/onboarding/president" replace />;
  }

  if (!hasClub) {
    return <Navigate to="/app/onboarding/club" replace />;
  }

  return <Outlet />;
};
