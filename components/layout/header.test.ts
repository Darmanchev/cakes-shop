import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("does not render a divider below the storefront header", async () => {
  const source = await readFile(
    resolve(process.cwd(), "components/layout/Header.tsx"),
    "utf8",
  );

  assert.doesNotMatch(source, /border-b border-\[#dfcec7\]\/80/);
});
