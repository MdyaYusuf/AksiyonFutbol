import { Navigate } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../../clubPresidents/clubPresidentsApiSlice";
import { useCheckCurrentUserHasClubQuery } from "../clubsApiSlice";
import { CreateClubForm } from "../components/CreateClubForm";

export const CreateClubPage = () => {
  const { data: hasPresident, isLoading: isPresidentLoading } =
    useCheckCurrentUserHasPresidentQuery();
  const { data: hasClub, isLoading: isClubLoading } = useCheckCurrentUserHasClubQuery(
    undefined,
    { skip: hasPresident !== true },
  );

  if (isPresidentLoading || isClubLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-on-surface-variant">
        Kulüp durumu kontrol ediliyor...
      </div>
    );
  }

  if (!hasPresident) {
    return <Navigate to="/app/onboarding/president" replace />;
  }

  if (hasClub) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <CreateClubForm />;
};
