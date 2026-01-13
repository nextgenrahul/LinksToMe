import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';


export class App {
    public app: Application;
    private port: number | string;
    constructor(port: number | string) {
        this.app = express();
        this.port = port;
        this.routes();


        this.initializeMiddlewares();
        this.initializeHealthCheck();
        // this.initializeRoutes(); // Future: inject routes here
    }

    private routes() {
        // ✅ HELLO WORLD CHECK
        this.app.get('/', (_req, res) => {
            res.status(200).json({
                success: true,
                message: 'Hello World 🚀 Linkstome backend is running'
            });
        });
    }
    /**
 * Private method to encapsulate middleware setup
 */
    private initializeMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(compression());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Setup internal health monitoring
     */
    private initializeHealthCheck(): void {
        this.app.get('/health', (req: Request, res: Response) => {
            res.status(200).json({ status: 'UP', timestamp: new Date() });
        });
    }

    /**
     * Public method to allow the server to start
     */
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`🚀 LinksToMe Engine running on port ${this.port}`);
        });
    }

}