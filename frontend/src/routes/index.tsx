import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import MainLayout from "@/layouts/MainLayout";
import { authRoutes } from "@/features/auth";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/features/common/NotFound";
import { searchRoutes } from "@/features/search";
import { profileRoutes } from "@/features/profile";
import { linksRoutes } from "@/features/Links";


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
            element: <Navigate to={PATHS.DASHBOARD} replace />,
          },
          {
            path: PATHS.DASHBOARD,
            element: <div>Dashboard Page Content</div>,
          },  
          {
            path: PATHS.ACHIEVEMENT,
            element: <div>Achievement Page Content</div>,
          },
          {
            path: PATHS.VAULT,
            element: <div>Vault Page Content</div>,
          },
            {
            path: PATHS.NOTIFICATIONS,
            element: <div>Notifications Page Content</div>,
          },
          // {
          //   path: PATHS.,
          //   element: <div>Notifications Page Content</div>,
          // },
          ...searchRoutes,
          ...profileRoutes,
            ...linksRoutes,


          
        ],
      },
    ],
  },
  
  { path: "*", element: <NotFound /> }
]);