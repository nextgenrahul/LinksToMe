import { RequestHandler, Router } from 'express';
import { ProfileController } from './profile.controller';
import { Route } from '../auth/auth.types';


export function profileRoute(controller: ProfileController): Router {

    const router = Router();

    const routes: Route[] = [
        {
            method: "get",
            path: "/profile/check",
            handler: controller.check,
        }
    ];

    routes.forEach((route) => {
        const handlers : RequestHandler[] = [];
        if(route.preHandler) handlers.push(route.preHandler);
        handlers.push(route.handler);
        router[route.method](route.path, ...handlers);
    });
    return router;

}