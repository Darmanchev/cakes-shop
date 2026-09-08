import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { getOrderFieldAccessibility } from "./order-form-accessibility";

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

test("applies the accessibility helper to every order field", async () => {
  const source = await readFile(
    resolve(process.cwd(), "features/orders/components/OrderForm.tsx"),
    "utf8",
  );

  for (const field of [
    "name",
    "phone",
    "email",
    "items",
    "date",
    "deliveryType",
    "deliveryAddress",
    "comment",
  ]) {
    assert.match(
      source,
      new RegExp(
        `getOrderFieldAccessibility\\(\\s*fieldErrors,\\s*"${field}"\\s*\\)`,
      ),
      `missing accessible error properties for ${field}`,
    );
  }
});
