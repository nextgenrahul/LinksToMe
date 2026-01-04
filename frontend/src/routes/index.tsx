import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "../constants/paths";
import { lazy, Suspense } from "react";
import MainLayout from "../layouts/MainLayout";
import Fallback from "../components/Loading/Fallback";

const Home = lazy(() => import("../features/reels/pages/HomePage"));
const Login = lazy(() => import("../features/auth/pages/Login"));
export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Fallback />}>
        <MainLayout />
      </Suspense>
    ),
    errorElement: <div>404 - Page Not Found.</div>,
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.HOME} />,
      },
      {
        path: PATHS.HOME,
        element: <Home />,
      },
      {
        path: PATHS.SEARCH,
        element: <div>Search Page</div>,
      },
      {
        path: PATHS.NOTIFICATIONS,
        element: <div>Notifications Page</div>,
      },
      {
        path: PATHS.PROFILE,
        element: <div>Profile Page</div>,
      },
    ],
  },
  {
    path: PATHS.LOGIN,
    element: (
      <Suspense fallback={<Fallback />}>
        <Login />
      </Suspense>
    ),
  },
]);
