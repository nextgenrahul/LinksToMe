import { Request, Router, Response, NextFunction, RequestHandler } from "express";
import { SignupPayloadSchema } from "@linkstome/shared";
import { SchemaValidator } from "../../shared/middlewares/validator";
import authController from "./auth.controller";
// import authMiddleware from './auth.midddleware';

interface Route {
    method: 'get' | 'post' | 'put' | 'delete' | 'patch';
    path: string;
    preValidation?: RequestHandler;
    preHandler?: RequestHandler;
    handler: RequestHandler;
}


class AuthRoutes {
    private router: Router;
    private controller;
    // private middleware;

    constructor() {
        this.router = Router();
        this.controller = authController;
        // this.middleware = authMiddleware;
    }

    public init(): Router {
        const routes: Route[] = [
            {
                method: 'post',
                path: '/signup',
                handler: this.controller.register.bind(this.controller),
            },
            // {
            //     method: 'post',
            //     path: '/login',
            //     handler: this.controller..bind(this.controller),
            // },
        ];
        routes.forEach((route) => {
            const handlers: RequestHandler[] = [];
            if (route.preValidation) handlers.push(route.preValidation);
            if (route.preHandler) handlers.push(route.preHandler);
            handlers.push(route.handler);

            // Dynamically assign to Express Router
            this.router[route.method](route.path, ...handlers);
        });
        return this.router;
    }
};


const authRoutes = new AuthRoutes();
export default authRoutes.init();