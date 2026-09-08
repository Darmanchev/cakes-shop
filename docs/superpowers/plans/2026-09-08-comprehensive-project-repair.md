# Comprehensive Project Repair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repair verified database, cart, checkout, administrator, accessibility, performance, and documentation defects without changing the bakery's business model or visual identity.

**Architecture:** Keep the existing Next.js/React/Prisma structure. Put normalization and validation in pure domain helpers, keep database-backed pricing authoritative, and exercise deployment scripts against an isolated PostgreSQL database.

**Tech Stack:** Next.js 16, React 19, TypeScript 6, Prisma 7, PostgreSQL 16, Node.js test runner, Docker Compose.

**Spec:** `docs/superpowers/specs/2026-09-08-comprehensive-project-repair-design.md`

## Global Constraints

- Preserve the existing visual design, product prices, catalog structure, and business workflow.
- Do not modify production data, deploy the application, or change secrets.
- Add a failing regression test before each behavioral production-code change.
- Use an explicitly named local test database for destructive database fixtures.
- Return controlled user-facing errors and keep raw failures in server logs.

---

### Task 1: Make database seeding valid and continuously tested

**Files:**
- Modify: `prisma/seed.ts`
- Create: `tests/database/seed.test.ts`
- Modify: `package.json`
- Modify: `.github/workflows/ci-cd.yml`

**Interfaces:**
- Consumes: `retiredProductIds: string[]`, Prisma's `Product.orderItems` relation, and `npm run db:seed`.
- Produces: a seed command that succeeds on the current schema and a database test command that exercises it in CI.

- [ ] **Step 1: Add a failing integration test for the real seed command**

```ts
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);

test("the product seed runs against the current Prisma schema", {
  skip: process.env.RUN_DB_TESTS !== "1",
}, async () => {
  const result = await execFileAsync("npm", ["run", "db:seed"], {
    cwd: process.cwd(),
    env: process.env,
  });

  assert.equal(result.stderr, "");
});
```

- [ ] **Step 2: Run the database test and verify the current seed fails**

Run after creating an isolated database and applying migrations:

```bash
RUN_DB_TESTS=1 DATABASE_URL=postgresql://postgres:postgres@localhost:5435/stas_cakes_shop_audit_20260908 node --import tsx --test tests/database/seed.test.ts
```

Expected: FAIL with Prisma reporting `Unknown argument orders`.

- [ ] **Step 3: Remove the obsolete relation from the seed predicate**

```ts
await prisma.product.deleteMany({
  where: {
    id: { in: retiredProductIds },
    orderItems: { none: {} },
  },
});
```

- [ ] **Step 4: Include the database test in project and CI verification**

Add a `test:database` script and execute it after migrations in CI:

```json
"test:database": "node --import tsx --test \"tests/database/**/*.test.ts\""
```

```yaml
- name: Test database scripts
  run: npm run test:database
  env:
    DATABASE_URL: postgresql://postgres:postgres@localhost:5432/stas_cakes_test
    RUN_DB_TESTS: "1"
```

- [ ] **Step 5: Verify the seed test passes and is idempotent**

Run the focused test twice with the same isolated database URL. Expected: PASS both times.

- [ ] **Step 6: Commit the seed repair**

```bash
git add prisma/seed.ts tests/database/seed.test.ts package.json .github/workflows/ci-cd.yml
git commit -m "fix: restore database seeding"
```

### Task 2: Normalize persisted carts and remove unavailable products

**Files:**
- Modify: `features/cart/cart.schema.ts`
- Modify: `features/cart/cart.service.ts`
- Modify: `features/cart/cart.service.test.ts`
- Modify: `features/cart/CartProvider.tsx`
- Modify: `features/orders/components/OrderForm.tsx`
- Modify: `lib/i18n.ts`

**Interfaces:**
- Produces: `retainAvailableCartItems(cart: Cart, productIds: ReadonlySet<string>): Cart` and `retainAvailableItems(productIds: readonly string[]): void` on the cart context.
- Consumes: the product IDs loaded by `OrderSection` from the authoritative catalog query.

- [ ] **Step 1: Add failing cart normalization tests**

```ts
test("normalizes persisted product IDs before duplicate detection", () => {
  const parsed = parseStoredCart({ items: [
    { productId: " cake-1 ", quantity: 2, comment: "" },
    { productId: "cake-1", quantity: 3, comment: "duplicate" },
  ] });

  assert.deepEqual(parsed.items, [
    { productId: "cake-1", quantity: 2, comment: "" },
  ]);
});

test("retains only products that are still available", () => {
  const cart = { items: [
    { productId: "cake-1", quantity: 2, comment: "" },
    { productId: "retired", quantity: 1, comment: "" },
  ] };

  assert.deepEqual(
    retainAvailableCartItems(cart, new Set(["cake-1"])),
    { items: [cart.items[0]] },
  );
});
```

- [ ] **Step 2: Run focused cart tests and verify both failures**

Run: `node --import tsx --test features/cart/cart.service.test.ts`

Expected: FAIL because whitespace IDs are not normalized and `retainAvailableCartItems` does not exist.

- [ ] **Step 3: Normalize IDs during stored-cart parsing**

Create a normalized item before checking the ID set and return normalized values. Keep the first valid duplicate and preserve quantity/comment values.

- [ ] **Step 4: Implement available-product reconciliation**

```ts
export function retainAvailableCartItems(
  cart: Cart,
  productIds: ReadonlySet<string>,
): Cart {
  const items = cart.items.filter((item) => productIds.has(item.productId));
  return items.length === cart.items.length ? cart : { items };
}
```

Expose an action from `CartProvider` that applies this helper and call it from `OrderForm` when the authoritative product list changes. Show the localized `unavailableProductsRemoved` notice only when one or more entries were removed.

- [ ] **Step 5: Run focused cart tests and the complete non-database suite**

Run: `node --import tsx --test features/cart/cart.service.test.ts`

Run: `npm test`

Expected: PASS.

- [ ] **Step 6: Commit the cart repair**

```bash
git add features/cart features/orders/components/OrderForm.tsx lib/i18n.ts
git commit -m "fix: reconcile persisted carts with the catalog"
```

### Task 3: Localize checkout validation and associate errors accessibly

**Files:**
- Modify: `features/orders/order.schema.ts`
- Modify: `features/orders/order.schema.test.ts`
- Create: `features/orders/order-form-accessibility.ts`
- Create: `features/orders/order-form-accessibility.test.ts`
- Modify: `features/orders/components/OrderForm.tsx`
- Modify: `features/products/components/CatalogContent.tsx`
- Modify: `app/api/orders/route.ts`
- Modify: `lib/i18n.ts`

**Interfaces:**
- Produces: `parseCreateOrderInput(value: unknown, language?: Language)` and `getOrderFieldAccessibility(errors, field)`.
- Consumes: the checkout client's exact `Accept-Language` value (`bg`, `en`, or `ru`); unknown values fall back to Bulgarian.

- [ ] **Step 1: Add failing localized-validation tests**

```ts
it("returns validation messages in the requested supported language", () => {
  const input = { ...validOrder(), name: "" };
  const english = parseCreateOrderInput(input, "en");
  const russian = parseCreateOrderInput(input, "ru");

  assert.equal(english.success, false);
  assert.equal(russian.success, false);
  if (!english.success) assert.equal(english.fieldErrors.name?.[0], "Enter your name");
  if (!russian.success) assert.equal(russian.fieldErrors.name?.[0], "Введите имя");
});
```

- [ ] **Step 2: Run the schema test and verify it fails because the parser has no locale support**

Run: `node --import tsx --test features/orders/order.schema.test.ts`

Expected: FAIL because both results currently use Bulgarian messages.

- [ ] **Step 3: Build the order schema from a typed message dictionary**

Define all validation messages for `bg`, `en`, and `ru`, including required name, phone, email, products, quantity, dates, address, and comment-length errors. Default the parser to `bg` so existing server and test callers remain compatible.

- [ ] **Step 4: Send and parse the checkout language**

Add `Accept-Language: language` to the client request. In the route, accept only an exact member of `LANGUAGES`; otherwise use `defaultLanguage`, then pass it to `parseCreateOrderInput`.

- [ ] **Step 5: Add failing accessibility-prop tests**

```ts
test("associates invalid fields with their error element", () => {
  assert.deepEqual(
    getOrderFieldAccessibility({ email: ["Invalid email"] }, "email"),
    { "aria-invalid": true, "aria-describedby": "email-error" },
  );
  assert.deepEqual(getOrderFieldAccessibility({}, "email"), {
    "aria-invalid": undefined,
    "aria-describedby": undefined,
  });
});
```

- [ ] **Step 6: Implement and apply accessible field-error props**

```ts
export function getOrderFieldAccessibility(
  errors: OrderFieldErrors,
  field: OrderFormField,
) {
  const invalid = Boolean(errors[field]?.length);
  return {
    "aria-invalid": invalid || undefined,
    "aria-describedby": invalid ? `${field}-error` : undefined,
  } as const;
}
```

Give each rendered error `<p>` the matching ID and apply the helper to its input, fieldset, or item group.

- [ ] **Step 7: Correct localized control labels and success copy**

Add localized catalog labels for previous, next, and close controls. Replace English and Russian success messages that mention connecting Telegram with a plain confirmation that the request was sent.

- [ ] **Step 8: Run focused and full tests**

Run: `node --import tsx --test features/orders/order.schema.test.ts features/orders/order-form-accessibility.test.ts`

Run: `npm test`

Expected: PASS.

- [ ] **Step 9: Commit checkout localization and accessibility**

```bash
git add app/api/orders/route.ts features/orders lib/i18n.ts features/products/components/CatalogContent.tsx
git commit -m "fix: localize and expose checkout errors"
```

### Task 4: Handle stale administrator order updates

**Files:**
- Modify: `features/orders/order.service.ts`
- Modify: `features/orders/order.service.integration.test.ts`
- Modify: `features/orders/order.admin.actions.ts`
- Modify: `app/admin/orders/page.tsx`

**Interfaces:**
- Produces: `updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean>`.
- Consumes: authenticated administrator server actions and the existing `/admin/orders` page.

- [ ] **Step 1: Add a failing integration test for a missing order**

```ts
it("reports a stale status update without throwing a Prisma not-found error", async () => {
  assert.equal(
    await updateOrderStatus(`${prefix}-missing`, "CONFIRMED"),
    false,
  );
});
```

- [ ] **Step 2: Run the database integration test and verify the Prisma update currently throws**

Run: `RUN_DB_TESTS=1 DATABASE_URL=postgresql://postgres:postgres@localhost:5435/stas_cakes_shop_audit_20260908 node --import tsx --test features/orders/order.service.integration.test.ts`

Expected: FAIL with Prisma record-not-found behavior.

- [ ] **Step 3: Use an atomic update count instead of exception control flow**

```ts
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const result = await prisma.order.updateMany({
    where: { id: orderId },
    data: { status },
  });

  return result.count === 1;
}
```

- [ ] **Step 4: Redirect stale actions to a controlled admin notice**

If the service returns false, redirect to `/admin/orders?error=order-not-found`. Parse only that exact error token on the page and show a non-sensitive notice; ignore unknown query values.

- [ ] **Step 5: Run the integration and full test suites**

Run the focused integration test, then `npm test`. Expected: PASS.

- [ ] **Step 6: Commit stale-update handling**

```bash
git add features/orders/order.service.ts features/orders/order.service.integration.test.ts features/orders/order.admin.actions.ts app/admin/orders/page.tsx
git commit -m "fix: handle stale admin order updates"
```

### Task 5: Remove runtime warnings, dead code, and inaccurate documentation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `components/sections/HeroSection.tsx`
- Modify: `components/sections/CategoryCardsSection.tsx`
- Modify: `components/sections/StorySection.tsx`
- Delete: `features/orders/order.actions.ts`
- Delete: `features/products/product.actions.ts`
- Delete: `features/orders/components/OrderStepsSection.tsx`
- Delete: `features/products/components/CareSection.tsx`
- Delete: `components/ui/InfoCard.tsx`
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Modify: `docs/database.md`
- Modify: `docs/env.md`

**Interfaces:**
- Consumes: current responsive breakpoints and the existing Bulgarian/Russian storefront font usage.
- Produces: correctly sized responsive image hints, Cyrillic font subsets, no unreferenced source modules, and documentation matching the current database-backed multi-item application.

- [ ] **Step 1: Confirm every deletion target has no runtime or test consumer**

Run:

```bash
rg -n "OrderStepsSection|CareSection|InfoCard|order\.actions|product\.actions" app components features lib tests
```

Expected: only imports among the listed dead files; no live consumer.

- [ ] **Step 2: Add responsive `sizes` hints and Cyrillic font subsets**

Use `(max-width: 768px) 100vw, 50vw` for half-width hero/story images and `(max-width: 768px) calc(100vw - 4rem), 33vw` for category cards. Add `cyrillic` to both Next font subset arrays.

- [ ] **Step 3: Remove verified dead modules**

Delete only the five files listed in this task after the consumer search passes.

- [ ] **Step 4: Update documentation to match the implementation**

Document muffins, multi-item carts/orders, database-backed products, `OrderItem`, current security controls, and the intentional production policy that migrations and initial seeding are separate operations.

- [ ] **Step 5: Run static and browser verification**

Run: `npm run db:generate`

Run: `npx prisma validate`

Run: `npx tsc --noEmit --incremental false`

Run: `npm run lint`

Run: `npm test`

Run: `npm run build`

Open the homepage, catalog, and order page at desktop and 375-pixel widths. Verify there are no console errors or responsive-image warnings and that navigation, language switching, cart reconciliation, dialog controls, and validation messages work.

- [ ] **Step 6: Run final security and diff checks**

Run: `npm audit --json`

Run: `git diff --check`

Review every changed file against the specification and remove unrelated changes.

- [ ] **Step 7: Commit final cleanup**

```bash
git add app components features README.md docs
git commit -m "chore: finish project quality repairs"
```
