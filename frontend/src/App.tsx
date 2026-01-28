import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { bootstrapAuth } from "./features/auth/store/authSlice";
import type { RootState } from "./store";

function App() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    // 🔥 One-time session bootstrap
    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Checking session...
      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
