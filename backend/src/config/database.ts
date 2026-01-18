import "dotenv/config";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";

/**
 * PostgreSQL Database Service
 * Optimized for Raw SQL mastery and high-scale connection pooling.
 */
class Database {
  private pool: Pool | null = null;
  private readonly showQueries: boolean;
  private readonly config: PoolConfig;

  constructor() {
    this.showQueries = process.env.DB_SHOW_QUERIES === "true";

    this.config = {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME,

      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,

      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    };
  }

  /**
   * Initialize PostgreSQL pool (Eager Initialization)
   * This is called once during App.bootstrap()
   */
  public async init(): Promise<Pool> {
    if (this.pool) return this.pool;

    try {
      const newPool = new Pool(this.config);

      // Event Listeners for Pool Monitoring
      newPool.on("connect", () => {
        if (this.showQueries) console.log("📡 DB: New Client Connected to Pool");
      });

      newPool.on("error", (err) => {
        console.error("❌ DB: Unexpected Pool Error", err);
      });

      // Verification: Await the first connection test
      await newPool.query("SELECT 1");
      
      this.pool = newPool;
      console.log("✅ DB: PostgreSQL Pool Verified and Ready");
      return this.pool;
    } catch (error) {
      console.error("❌ DB: Critical Initialization Failure");
      throw error;
    }
  }

  /**
   * Internal helper to ensure pool is ready
   */
  private async getActivePool(): Promise<Pool> {
    if (!this.pool) {
      // If code reaches here, bootstrap() was likely skipped.
      return await this.init();
    }
    return this.pool;
  }

  /**
   * Execute parameterized query with performance tracking
   */
  public async query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    params: any[] = []
  ): Promise<QueryResult<T>> {
    const activePool = await this.getActivePool();
    const start = Date.now();

    try {
      const result = await activePool.query<T>(sql, params);

      if (this.showQueries) {
        const duration = Date.now() - start;
        if (duration > 150) { // Highlight slow queries for optimization
          console.warn(`⚠️ Slow query (${duration}ms): ${sql.substring(0, 100)}...`);
        }
      }

      return result;
    } catch (error: any) {
      console.error("❌ DB: Query Execution Failed", {
        code: error.code,
        message: error.message,
        sql: sql.substring(0, 200),
      });
      throw error;
    }
  }

  /**
   * Graceful Shutdown
   */
  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log("🔒 DB: Pool Terminated");
      this.pool = null;
    }
  }
}

const dbService = new Database();
export default dbService;