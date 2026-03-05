import { Router, RequestHandler } from "express";
import { AchievementController } from "./achievement.controller";
import { Route } from "../profile/profile.types";
import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";

export function achievementRoute(controller: AchievementController, authMiddleware: AuthMiddleware
): Router {

    const router = Router();

    const routes: Route[] = [
        {
            method: "get",
            path: "/achievement",
            handler: controller.check,
        },
    ];

    routes.forEach((route) => {
        const handlers: RequestHandler[] = [];

        if (route.preValidation) handlers.push(route.preValidation);
        if (route.preHandler) handlers.push(route.preHandler);

        handlers.push(route.handler);

        router[route.method](route.path, ...handlers);
    });

    return router;
}
