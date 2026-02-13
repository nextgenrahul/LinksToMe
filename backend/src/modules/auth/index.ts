import { authRoutes } from "./auth.routes";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.services";
import { AuthRepository } from "./auth.repository";
import {AuthMiddleware} from "../../shared/middlewares/auth.middleware";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware(authRepository);

export default {
  routes: authRoutes(authController),
  controller: authController,
  service: authService,
  repository: authRepository,
  middleware: authMiddleware,
};
