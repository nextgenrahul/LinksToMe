import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import MainLayout from "@/layouts/MainLayout";
import { authRoutes } from "@/features/auth";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/features/common/NotFound";
import { searchRoutes } from "@/features/search";
import { profileRoutes } from "@/features/profile";


export const router = createBrowserRouter([
  ...authRoutes,

  {
    path: "/",
    element: <ProtectedRoute />, 
    errorElement: <div>404 - Page Not Found.</div>,
    children: [
      {
        element: <MainLayout />, 
        children: [
          { 
            index: true,
            element: <Navigate to={PATHS.HOME} replace />,
          },
          {
            path: PATHS.HOME,
            element: <div>Home Page Content</div>,
          },
          ...searchRoutes,
          ...profileRoutes

          
        ],
      },
    ],
  },
  
  { path: "*", element: <NotFound /> }
]);