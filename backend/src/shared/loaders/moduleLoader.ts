import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Express, Router, Application } from "express";

interface Config {
  modulesPath: string;
  apiVersion: string;
  apiBasePath: string;
  // Define which modules require mandatory authentication at the top level
  authRequiredForModule: Record<string, boolean>;
}

const DEFAULT_CONFIG: Config = {
  modulesPath: path.join(dirname(fileURLToPath(import.meta.url)), "../../modules"),
  apiVersion: "v1", 
  apiBasePath: "/api",
  authRequiredForModule: {
    profile: true,
    settings: true,
  },
};

class ModuleLoader {
  private config: Config;
  private modules: Map<string, any> = new Map();
  private logger: Console = console;

  constructor(config: Partial<Config> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Dynamically imports the default export from each module's index.ts
   */
  async loadModules() {
    try {
      const moduleDirs = await fs.readdir(this.config.modulesPath, { withFileTypes: true });
      
      for (const dirent of moduleDirs) {
        if (dirent.isDirectory()) {
          const moduleName = dirent.name;
          try {
            // Standard: Every module must have an index.ts that exports its routes/controller/service
            const modulePath = path.join(this.config.modulesPath, moduleName, "index.ts");
            const moduleImport = await import(`file://${modulePath}`);
            this.modules.set(moduleName, moduleImport.default);
            this.logger.log(`📦 Module loaded: [${moduleName}]`);
          } catch (err: any) {
            this.logger.error(`❌ Error loading module ${moduleName}: ${err.message}`);
          }
        }
      }
      return this.modules;
    } catch (err: any) {
      this.logger.error("Critical error reading modules directory:", err.message);
      return this.modules;
    }
  }

  /**
   * Attaches module routers to the main Express application
   */
  async registerRoutes(app: Application) {
    const apiPrefix = `${this.config.apiBasePath}/${this.config.apiVersion}`;

    // 1. Pre-load Auth Middleware if it exists in the 'auth' module
    let authGuard: any = null;
    const authModule = this.modules.get("auth");
    if (authModule?.middleware) {
      authGuard = authModule.middleware.verify.bind(authModule.middleware);
    }

    for (const [moduleName, moduleObj] of this.modules) {
      // Each module must export an 'init' function or a 'router' object
      if (moduleObj?.routes) {
        const fullPath = `${apiPrefix}/${moduleName}`;
        const requiresGlobalAuth = this.config.authRequiredForModule[moduleName] ?? false;

        this.logger.log(`🚀 Routing: ${fullPath} --> ${moduleName}Module`);

        // Apply Global Auth Guard if configured for this module
        if (requiresGlobalAuth && authGuard) {
          app.use(fullPath, authGuard);
        }

        // Attach the module's router
        // moduleObj.routes should be the Express Router instance we built in the previous step
        app.use(fullPath, moduleObj.routes);
      }
    }
  }
}

export default new ModuleLoader();