import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import Loadable from "@/components/Loading/Loadable";
// import Loadable from "../../components/Loading/Loadable"; 
// const LoginPage = Loadable(lazy(() => import("./pages/LoginPage")));
// const SignUpPage = Loadable(lazy(() => import("./pages/SignUpPage")));
const Profile = Loadable(lazy(() => import("./pages/Profile")));
export const profileRoutes: RouteObject[] = [
  {
    path: PATHS.PROFILE,
    element: <Profile/>,
  }
];


