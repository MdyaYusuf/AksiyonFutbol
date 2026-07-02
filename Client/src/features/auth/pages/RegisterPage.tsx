import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../core/store/hooks";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return <RegisterForm />;
};
