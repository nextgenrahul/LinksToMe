import { RequestHandler, Router } from "express";
import { SignupPayloadSchema, SigninPayloadSchema } from "@linkstome/shared";
import { SchemaValidator } from "../../shared/middlewares/validator";
import { AuthController } from "./auth.controller";
import { Route } from "./auth.types";
import { AuthMiddleware } from "backend/src/shared/middlewares/auth.middleware";

export function authRoutes(controller: AuthController, authMiddleware: AuthMiddleware): Router {
  const router = Router();

  const routes: Route[] = [
    {
      method: "post",
      path: "/signup",
      preHandler: SchemaValidator.validate(SignupPayloadSchema),
      handler: controller.register,
    },
    {
      method: "post",
      path: "/login",
      preHandler: SchemaValidator.validate(SigninPayloadSchema),
      handler: controller.login,
    },
    {
      method: "post",
      path: "/logout",
      handler: controller.logout,
    },
    {
      method: "post",
      path: "/refresh",
      handler: controller.refresh,
    },
    {
      method: "get",
      path: "/me",
      preHandler: authMiddleware.verify,
      handler: controller.me,
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
