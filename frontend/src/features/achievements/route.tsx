import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import Loadable from "../../components/Loading/Loadable"; 
const Achievement = Loadable(lazy(() => import("./pages/Achievement")));

export const achievementRoutes: RouteObject[] = [
  {
    path: PATHS.ACHIEVEMENT,
    element: <Achievement />,
  }
];


