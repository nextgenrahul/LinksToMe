import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import moduleLoader from "./shared/loaders/moduleLoader";
import dbService from "./config/database"; // Using your Raw SQL Pool service
import { globalErrorHandler } from './shared/middlewares/error.middleware';
import { AppError } from './shared/utils/AppError';


export class App {
    public app: Application;
    private port: number | string;

    constructor(port: number | string) {
        this.app = express();
        this.port = port;
        
        // Configuration Flow
        this.initializeMiddlewares();
        this.initializeHealthCheck();
    }

    /**
     * Initializes Global Middlewares
     * Focus: Security, Performance, and Parsing
     */
    private initializeMiddlewares(): void {
        this.app.use(helmet()); // High-level security headers
        this.app.use(cors());   // Cross-Origin Resource Sharing
        this.app.use(compression()); // Gzip compression for faster responses
        this.app.use(express.json()); // Body parsing
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Standard Health Monitoring
     */
    private initializeHealthCheck(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ 
                status: 'UP', 
                timestamp: new Date(),
                uptime: process.uptime() 
            });
        });

        this.app.get('/', (req: Request, res: Response) => {
            res.status(200).json({
                success: true,
                message: '🚀 LinksToMe Backend Engine is Live'
            });
        });
    }

    /** 
     * Asynchronous Bootstrap Process
     * Connects DB and loads dynamic modules before the server starts
     */
    public async bootstrap(): Promise<void> {
        try {
            // 1. Connect to PostgreSQL (Raw SQL Pool)
            await dbService.init(); 
            console.log('✅ Database connected successfully');

            // 2. Load Dynamic Modules from src/modules
            await moduleLoader.loadModules();
            
            // 3. Register Routes automatically
            await moduleLoader.registerRoutes(this.app);
            console.log('📦 All modules registered');

            // 4. Handle unknown routes (404)
            this.app.all('*', (req, res, next) => {
                next(
                    new AppError(
                        `Sorry, the page ${req.originalUrl} could not be found.`,
                        404
                    )
                );
            });

            // 5. Global Error Middleware 
            this.app.use(globalErrorHandler);

        } catch (error) {
            console.error('❌ Critical failure during bootstrap:', error);
            process.exit(1);
        }
    }

    /**
     * Public method to ignite the engine
     */
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`📡 [PRODUCTION] LinksToMe Engine running on port ${this.port}`);
        });
    }
}