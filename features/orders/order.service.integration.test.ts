import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/features/products/product.service";
import {
  createOrder,
  getOrders,
  ProductNotFoundError,
  updateOrderStatus,
} from "./order.service";
import type { CreateOrderInput } from "./order.schema";

const run = process.env.RUN_DB_TESTS === "1";
const prefix = `audit-${crypto.randomUUID()}`;
const productId = `${prefix}-cake`;
const comboId = `${prefix}-combo`;
const secondId = `${prefix}-second`;
const fixtureIds = [productId, comboId, secondId, "cin-3"];
let fixturesCreated = false;

function input(id = productId): CreateOrderInput {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 7);
  return {
    name: "Audit Customer", phone: "+359888123456", email: "audit@example.com",
    items: [{ productId: id, quantity: 2, comment: "No nuts" }],
    date: date.toISOString().slice(0, 10), deliveryType: "PICKUP",
    deliveryAddress: "", comment: "Audit only",
  };
}

describe("order persistence", { skip: !run }, () => {
  before(async () => {
    const url = new URL(process.env.DATABASE_URL ?? "");
    assert.match(url.pathname, /_(?:audit|test)(?:_|$)/, "Use an isolated test database");
    assert.ok(["localhost", "127.0.0.1"].includes(url.hostname), "Use a local test database");
    await prisma.product.createMany({ data: [
      { id: secondId, category: "CAKES" as const, priceMinor: 500 },
      { id: productId, category: "CAKES" as const, priceMinor: 1234 },
      { id: comboId, category: "COMBOS" as const, priceMinor: 500 },
      { id: "cin-3", category: "CINNABONS" as const, priceMinor: 500 },
    ].map((product) => ({ ...product, name: product.id, description: "Audit", image: "/test.png", prepTime: "2 days" })) });
    fixturesCreated = true;
  });
  after(async () => {
    if (!fixturesCreated) {
      await prisma.$disconnect();
      return;
    }
    await prisma.order.deleteMany({ where: { items: { some: { productId: { in: fixtureIds } } } } });
    await prisma.product.deleteMany({ where: { id: { in: fixtureIds } } });
    await prisma.$disconnect();
  });

  it("uses database prices and encrypts customer and item comments", async () => {
    const order = await createOrder(input());
    assert.equal(order.totalMinor, 2468);
    assert.equal(order.items[0].unitPriceMinor, 1234);
    assert.equal(order.items[0].comment, "No nuts");
    const stored = await prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: { items: true } });
    assert.match(stored.name, /^enc:v1:/);
    assert.match(stored.items[0].comment!, /^enc:v1:/);
  });

  it("saves a basket with more than one product", async () => {
    const order = await createOrder({ ...input(), items: [
        { productId, quantity: 2 }, { productId: secondId, quantity: 3 },
    ] });
    assert.equal(order.totalMinor, 3968);
    assert.equal(order.items.length, 2);
  });

  it("rejects products outside the active catalog", async () => {
    for (const id of [comboId, "cin-3"]) {
      await assert.rejects(createOrder(input(id)), ProductNotFoundError);
    }
  });

  it("does not display a retired cinnabon retained for historical orders", async () => {
    const products = await getProducts();
    assert.equal(products.some((product) => product.id === "cin-3"), false);
  });

  it("retains future bookings even when they were created before the retention cutoff", async () => {
    const previousRetention = process.env.ORDER_RETENTION_DAYS;
    process.env.ORDER_RETENTION_DAYS = "30";
    try {
      const order = await createOrder(input());
      const old = new Date();
      old.setUTCDate(old.getUTCDate() - 40);
      await prisma.order.update({ where: { id: order.id }, data: { createdAt: old } });
      await getOrders();
      assert.ok(await prisma.order.findUnique({ where: { id: order.id } }));
      await prisma.order.update({ where: { id: order.id }, data: { date: old } });
      await getOrders();
      assert.equal(await prisma.order.findUnique({ where: { id: order.id } }), null);
    } finally {
      if (previousRetention === undefined) delete process.env.ORDER_RETENTION_DAYS;
      else process.env.ORDER_RETENTION_DAYS = previousRetention;
    }
  });

  it("clamps pages to the available results and normalizes nonfinite pagination", async () => {
    const orders = await getOrders(999, 1);
    assert.equal(orders.page, orders.pageCount);
    assert.ok(orders.items.length > 0);
    const defaultPage = await getOrders(NaN, Infinity);
    assert.equal(defaultPage.page, 1);
    assert.ok(defaultPage.items.length > 0);
  });

  it("reports a stale status update without throwing a Prisma not-found error", async () => {
    assert.equal(
      await updateOrderStatus(`${prefix}-missing`, "CONFIRMED"),
      false,
    );
  });
});
