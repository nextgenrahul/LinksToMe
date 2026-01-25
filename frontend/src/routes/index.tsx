import { createBrowserRouter, Navigate } from "react-router-dom";
import { PATHS } from "@/constants/paths";
import MainLayout from "@/layouts/MainLayout";
// import { ProtectedRoute } from "./ProtectedRoute";
import { authRoutes } from "@/features/auth";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/features/common/NotFound";

// Example of how you will add future features
// import { feedRoutes } from "@/features/feed/routes";

export const router = createBrowserRouter([
  // 1. PUBLIC ROUTES (Login, Signup, Landing)
  ...authRoutes,

  // 2. PROTECTED ROUTES (Requires Authentication)
  {
    path: "/",
    element: <ProtectedRoute />, // Higher-order component for security
    // element: <ProtectedRoute />, // Higher-order component for security
    errorElement: <div>404 - Page Not Found.</div>,
    children: [
      {
        element: <MainLayout />, // The Sidebar/Navbar wrapper
        children: [
          { 
            index: true,
            element: <Navigate to={PATHS.HOME} replace />,
          },
          {
            path: PATHS.HOME,
            element: <div>Home Page Content</div>,
            // ...feedRoutes (spread other feature routes here)
          },
          
        ],
      },
    ],
  },
  
  // 3. CATCH ALL
  { path: "*", element: <NotFound /> }
]);