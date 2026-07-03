import { Navigate } from "react-router-dom";
import { useCheckCurrentUserHasPresidentQuery } from "../clubPresidentsApiSlice";
import { CreatePresidentForm } from "../components/CreatePresidentForm";

export const CreatePresidentPage = () => {
  const { data: hasPresident, isLoading } = useCheckCurrentUserHasPresidentQuery();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-on-surface-variant">
        Profil kontrol ediliyor...
      </div>
    );
  }

  if (hasPresident) {
    return <Navigate to="/app/onboarding/club" replace />;
  }

  return <CreatePresidentForm />;
};
