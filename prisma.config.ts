import { defineConfig } from "prisma/config";

const LOCAL_DATABASE_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function validateDatabaseUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    if (url.searchParams.get("sslmode") !== "verify-full") {
      throw new Error("Production DATABASE_URL must use sslmode=verify-full");
    }

    if (LOCAL_DATABASE_HOSTS.has(url.hostname)) {
      throw new Error(
        "Production DATABASE_URL must not use a local database host",
      );
    }
  }

  return databaseUrl;
}

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return validateDatabaseUrl(process.env.DATABASE_URL);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("DATABASE_URL is required in production");
  }

  return "postgresql://postgres:postgres@localhost:5435/stas_cakes_shop";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node --import tsx prisma/seed.ts",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
