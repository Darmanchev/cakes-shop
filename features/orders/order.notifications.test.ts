import assert from "node:assert/strict";
import test from "node:test";
import { formatOrderTelegramMessage } from "./order.notifications";
import type { OrderWithItems } from "./order.service";

test("keeps the requested calendar date on servers west of UTC", () => {
  const previousTimezone = process.env.TZ;
  process.env.TZ = "America/Los_Angeles";
  try {
    const order: OrderWithItems = {
      id: "test-order", name: "Customer", phone: "", email: "",
      deliveryType: "PICKUP", deliveryAddress: "", currency: "EUR", totalMinor: 2000,
      date: new Date("2026-09-08T00:00:00Z"), comment: null, status: "NEW",
      items: [], createdAt: new Date("2026-09-07T10:00:00Z"), updatedAt: new Date("2026-09-07T10:00:00Z"),
    };
    assert.match(formatOrderTelegramMessage(order), /8\.09\.2026/);
  } finally {
    if (previousTimezone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimezone;
  }
});
