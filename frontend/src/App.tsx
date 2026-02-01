import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { bootstrapAuth } from "./features/auth/store/authSlice";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("🔥 dispatching bootstrapAuth");
    dispatch(bootstrapAuth());
  }, [dispatch]);

  return (
    <>
      <RouterProvider router={router} />;
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
