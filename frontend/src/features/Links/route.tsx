import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { PATHS } from "../../constants/paths";
import Loadable from "@/components/Loading/Loadable";
const LinksPage = Loadable(lazy(() => import("./pages/LinksPage")));
export const linksRoutes: RouteObject[] = [
  {
    path: PATHS.LINKS,
    element: <LinksPage/>,
  }
];


