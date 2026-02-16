import { Router, RequestHandler } from "express";
import { ProfileController } from "./profile.controller";
import { Route } from "../auth/auth.types";
import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";

export function profileRoute(
    controller: ProfileController,
    authMiddleware: AuthMiddleware
): Router {

    const router = Router();

    const routes: Route[] = [
        // 🔹 Public - Check username
        {
            method: "get",
            path: "/check",
            handler: controller.checkUsername,
        },

        // 🔹 Protected - Get my profile
        {
            method: "get",
            path: "/me",
            preHandler: authMiddleware.verify,
            handler: controller.getMyProfile,
        },

        // 🔹 Protected - Update my profile
        {
            method: "patch",
            path: "/me",
            preHandler: authMiddleware.verify,
            handler: controller.updateProfile,
        },

        // 🔹 Public - Get profile by username
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
