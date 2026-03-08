import { Router, RequestHandler } from "express";
import { LinksController } from "./links.controller";
import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { Route } from "./links.types";

export function linksRoute(
    controller: LinksController,
    authMiddleware: AuthMiddleware
): Router {
    const router = Router();

    const routes: Route[] = [
    
        {
            
            method: "get",
            path: "/r/:slug",
            handler: controller.redirect,
        },

        {
           
            method: "get",
            path: "/:id/analytics",
            preHandler: authMiddleware.verify,
            handler: controller.getAnalytics,
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
