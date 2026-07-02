import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "./core/store/hooks";
import { authService } from "./features/auth/authService";
import { setCredentials } from "./features/auth/authSlice";

function App() {
  const dispatch = useAppDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    authService
      .checkAuth()
      .then((response) => {
        if (response.success && response.data) {
          dispatch(setCredentials(response.data));
        }
      })
      .catch(() => {
        /* Fail silently if no valid cookie exists */
      })
      .finally(() => setIsInitializing(false));
  }, [dispatch]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-on-surface-variant">
        Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <Outlet />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}

export default App;
