
import 'dotenv/config';
import { App } from './app';
import { prisma } from './config/prisma';

class Server {
  private application: App;

  constructor() {
    this.application = new App(process.env.PORT || 5000);
    this.setupBigIntSerialization();
  }

  private setupBigIntSerialization(): void {
    (BigInt.prototype as any).toJSON = function () {
      return this.toString();
    };
  }

  public async run(): Promise<void> {
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL Database connected via Prisma Adapter');
      
      this.application.listen();
      this.handleGracefulShutdown();
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }


  private handleGracefulShutdown(): void {
    const shutdown = async (signal: string) => {
      console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
      try {
        await prisma.$disconnect();
        console.log('🔌 Database connection closed. Process exiting.');
        process.exit(0);
      } catch (err) {
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }
}

// Instantiate and execute
const server = new Server();
server.run();