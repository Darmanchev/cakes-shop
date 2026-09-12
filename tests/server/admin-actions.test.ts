import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { afterEach, test, mock } from "node:test";
let sessions = 0;
const database = {
  rateLimit: { deleteMany: async () => ({ count: 0 }) },
  $queryRaw: async () => { throw new Error("Database unavailable"); },
  adminSession: {
    findUnique: async () => ({
      tokenHash: "test", expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date(), lastSeenAt: new Date(),
    }),
    deleteMany: async () => {
      const count = sessions;
      sessions = 0;
      return { count };
    },
  },
};
mock.module(new URL("../../lib/prisma.ts", import.meta.url).href, { namedExports: { prisma: database } });
mock.module("server-only", { defaultExport: {} });

const nextHeaders = createRequire(import.meta.url)("next/headers") as typeof import("next/headers");
afterEach(() => mock.restoreAll());

test("login returns an error state when its database is unavailable", async () => {
  const { loginAdmin } = await import("@/features/admin/admin.actions");
  mock.method(nextHeaders, "headers", async () => new Headers());
  mock.method(console, "error", () => {});
  const result = await loginAdmin({ error: null }, new FormData());
  assert.equal(typeof result.error, "string");
  assert.ok(result.error);
});

for (const authenticated of [false, true]) {
  test(`global logout ${authenticated ? "revokes sessions for an authenticated admin" : "preserves sessions for an unauthenticated caller"}`, async () => {
    const { logoutAllAdminSessions } = await import("@/features/admin/admin.actions");
    sessions = 3;
    let cookieDeleted = false;
    mock.method(nextHeaders, "cookies", async () => ({
      get: () => authenticated ? { value: "valid-test-session" } : undefined,
      delete: () => { cookieDeleted = true; },
    }));
    await assert.rejects(logoutAllAdminSessions(), /NEXT_REDIRECT/);
    assert.equal(sessions, authenticated ? 0 : 3);
    assert.equal(cookieDeleted, authenticated);
  });
}
