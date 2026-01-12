import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;

// 1. Setup the Native PostgreSQL Pool
const pool = new pg.Pool({ 
  connectionString,
  max: 20, // Prevent database connection exhaustion
  idleTimeoutMillis: 30000 
});

// 2. Setup the Adapter
const adapter = new PrismaPg(pool);

// 3. Prevent multiple instances during development hot-reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * STRATEGIC FIX: BigInt Serialization
 * Standard JSON.stringify fails on BigInt (your User ID).
 * This prototype override ensures your API never crashes when sending IDs.
 */
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};