import { RequestHandler, Router } from "express";
import { SignupPayloadSchema } from "@linkstome/shared";
import { SchemaValidator } from "../../shared/middlewares/validator";
import authController from "./auth.controller";
import authMiddleware from "../../shared/middlewares/auth.middleware";
import { Route } from "./auth.types";



class AuthRoutes {
    private router: Router;
    private controller: typeof authController;
    private middleware: typeof authMiddleware;

    constructor() {
        this.router = Router();
        this.controller = authController;
        this.middleware = authMiddleware;
    }

    public init(): Router {
        const routes: Route[] = [
            {
                method: 'post',
                path: '/signup',
                handler: this.controller.register.bind(this.controller),
            },
            {
                method: 'post',
                path: '/login',
                handler: this.controller.login.bind(this.controller),
            },
            {
                method: 'post',
                path: '/logout',
                handler: this.controller.logout.bind(this.controller),
            },
            {
                method: 'post',
                path: '/refresh',
                handler: this.controller.generateRefreshToken.bind(this.controller),
            },
            {
                method: "get",
                path: "/me",
                preHandler: this.middleware.verify,
                handler: this.controller.me.bind(this.controller),
            }

        ];
        routes.forEach((route) => {
            const handlers: RequestHandler[] = [];
            if (route.preValidation) handlers.push(route.preValidation);
            if (route.preHandler) handlers.push(route.preHandler);
            handlers.push(route.handler);

            this.router[route.method](route.path, ...handlers);
        });
        return this.router;
    }
};


const authRoutes = new AuthRoutes();
export default authRoutes.init();