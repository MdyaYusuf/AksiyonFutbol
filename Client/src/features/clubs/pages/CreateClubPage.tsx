import { Navigate } from "react-router-dom";
import {
  ONBOARDING_PRESIDENT_PATH,
  resolveOnboardingPath,
} from "../../../core/routes/onboardingPaths";
import { useCheckCurrentUserHasPresidentQuery } from "../../clubPresidents/clubPresidentsApiSlice";
import { useCheckCurrentUserHasClubQuery, useGetCurrentUserClubQuery } from "../clubsApiSlice";
import { CreateClubForm } from "../components/CreateClubForm";

export const CreateClubPage = () => {
  const { data: hasPresident, isLoading: isPresidentLoading } =
    useCheckCurrentUserHasPresidentQuery();
  const { data: hasClub, isLoading: isClubLoading } = useCheckCurrentUserHasClubQuery(
    undefined,
    { skip: hasPresident !== true },
  );
  const { data: club, isLoading: isClubDetailLoading } = useGetCurrentUserClubQuery(
    undefined,
    { skip: hasClub !== true },
  );

  if (isPresidentLoading || isClubLoading || isClubDetailLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-on-surface-variant">
        Kulüp durumu kontrol ediliyor...
      </div>
    );
  }

  if (!hasPresident) {
    return <Navigate to={ONBOARDING_PRESIDENT_PATH} replace />;
  }

  if (hasClub) {
    return (
      <Navigate
        to={resolveOnboardingPath(true, true, club?.lifecycleStatus)}
        replace
      />
    );
  }

  return <CreateClubForm />;
};
