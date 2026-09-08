import assert from "node:assert/strict";
import { mock, test } from "node:test";

mock.module(new URL("../../lib/prisma.ts", import.meta.url).href, {
  namedExports: { prisma: {
    rateLimit: { deleteMany: async () => ({ count: 0 }) },
    $queryRaw: async () => { throw new Error("Database unavailable"); },
  } },
});

test("returns a controlled JSON response when rate-limit storage fails", async () => {
  const { POST } = await import("../../app/api/orders/route");
  const logger = mock.method(console, "error", () => {});
  try {
    const response = await POST(new Request("http://localhost/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: "{}",
    }));
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error: "Internal server error" });
  } finally {
    logger.mock.restore();
  }
});
