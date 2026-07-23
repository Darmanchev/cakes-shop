import { defineConfig } from 'prisma/config';

function validateDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);

  if (process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE !== 'phase-production-build' &&
      !['require', 'verify-ca', 'verify-full'].includes(url.searchParams.get('sslmode') ?? '')
  ) {
    throw new Error('Production DATABASE_URL must require TLS via sslmode');
  }

  return databaseUrl;
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return validateDatabaseUrl(process.env.DATABASE_URL);
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('DATABASE_URL is required in production');
  }

  return 'postgresql://postgres:postgres@localhost:5435/stas_cakes_shop';
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'node --import tsx prisma/seed.ts',
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
