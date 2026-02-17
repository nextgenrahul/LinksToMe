import { Router, RequestHandler } from "express";
import { ProfileController } from "./profile.controller";
import { Route } from "../profile/profile.types";
import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";

export function profileRoute(controller: ProfileController, authMiddleware: AuthMiddleware
): Router {

    const router = Router();

    const routes: Route[] = [
        {
            method: "get",
            path: "/check",
            handler: controller.checkUsername,
        },

        {
            method: "get",
            path: "/me",
            preHandler: authMiddleware.verify,
            handler: controller.getMyProfile,
        },

        {
            method: "patch",
            path: "/me",
            preHandler: authMiddleware.verify,
            handler: controller.updateProfile,
        },

        {
            method: "get",
            path: "/:username",
            handler: controller.getProfile,
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
