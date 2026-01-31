import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { bootstrapAuth } from "./features/auth/store/authSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔥 dispatching bootstrapAuth");
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;
