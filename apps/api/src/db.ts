import { PrismaClient } from '@prisma/client';
import { env } from './env';

/**
 * Singleton Prisma client.
 * In development tsx-watch reloads modules on change; we reuse the same
 * client on the global to avoid exhausting the connection pool.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
