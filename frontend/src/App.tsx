import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useDispatch } from "react-redux";
import apiClient from "./shared/api/apiClient";
import { useEffect } from "react";
import {
  clearAuth,
  setAuth,
  setLoading,
} from "./features/auth/store/authSlice";
import { useAppSelector } from "./store/hooks";
import type { RootState } from "./store";

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        dispatch(setLoading(true));
        const res = await apiClient.post("/auth/refresh");

        if (!isMounted) return;

        dispatch(
          setAuth({
            user: res.data.user,
            token: res.data.accessToken,
          }),
        );
      } catch {
        if (isMounted) dispatch(clearAuth());
      } finally {
        if (isMounted) dispatch(setLoading(false));
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">
      Checking session...
    </div>;
  }

  return <RouterProvider router={router} />;
}

export default App;
