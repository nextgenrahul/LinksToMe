import "dotenv/config";
import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";


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

  public async init(): Promise<Pool> {
    if (this.pool) return this.pool;

    try {
      const newPool = new Pool(this.config);

      // Event Listeners for Pool Monitoring
      newPool.on("connect", () => {
        if (this.showQueries) console.log("DB: New Client Connected to Pool");
      });

      newPool.on("error", (err) => {
        console.error("DB: Unexpected Pool Error", err);
      });

      await newPool.query("SELECT 1");
      
      this.pool = newPool;
      console.log("DB: PostgreSQL Pool Verified and Ready");
      return this.pool;
    } catch (error) {
      console.error("DB: Critical Initialization Failure");
      throw error;
    }
  }


  private async getActivePool(): Promise<Pool> {
    if (!this.pool) {
      // If code reaches here, bootstrap() was likely skipped.
      return await this.init();
    }
    return this.pool;
  }


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
        if (duration > 150) { 
          console.warn(`Slow query (${duration}ms): ${sql.substring(0, 100)}...`);
        }
      }

      return result;
    } catch (error: any) {
      console.error("DB: Query Execution Failed", {
        code: error.code,
        message: error.message,
        sql: sql.substring(0, 200),
      });
      throw error;
    }
  }


  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      console.log("DB: Pool Terminated");
      this.pool = null;
    }
  }
}

const dbService = new Database();
export default dbService;