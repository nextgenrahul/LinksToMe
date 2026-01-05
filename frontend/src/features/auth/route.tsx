import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import Loadable from "../../components/Loading/Loadable"; 

const LoginPage = Loadable(lazy(() => import("./pages/LoginPage")));
const SignUpPage = Loadable(lazy(() => import("./pages/SignUpPage")));

export const authRoutes: RouteObject[] = [
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.SIGNUP,
    element: <SignUpPage />,
  },
];