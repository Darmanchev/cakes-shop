import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import {validateDatabaseUrl} from '@/lib/security/env';

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return validateDatabaseUrl(databaseUrl);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production');
  }

  return 'postgresql://postgres:postgres@localhost:5435/stas_cakes_shop';
}

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({adapter});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
