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
        // ─── Public ───────────────────────────────────────────────────────────
        {
            // Redirect route — no auth required
            // GET /r/:slug  → resolves slug, records click, 302 redirects
            method: "get",
            path: "/r/:slug",
            handler: controller.redirect,
        },

        // ─── Protected ────────────────────────────────────────────────────────
        {
            // Analytics for a specific link — auth required
            // GET /links/:id/analytics
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
