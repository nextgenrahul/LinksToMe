import { defineConfig, env } from 'prisma/config';
import 'dotenv/config'; // Crucial to load .env variables

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'), // Prisma CLI uses this for migrations
  },
});