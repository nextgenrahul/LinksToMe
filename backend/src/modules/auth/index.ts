import authRoutes from './auth.routes';
import authController from './auth.controller';
import authService from './auth.services';
import authRepository from './auth.repository';
// import authMiddleware from './auth.middleware';

/**
 * Standard Module Export
 * Compatible with dynamic ModuleLoader.ts
 */
export default {
  routes: authRoutes,
  controller: authController,
  service: authService,
  repository: authRepository,
//   middleware: authMiddleware
};