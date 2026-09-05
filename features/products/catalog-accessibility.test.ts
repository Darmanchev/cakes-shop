import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const catalogPath = resolve(
  process.cwd(),
  "features/products/components/CatalogContent.tsx",
);

test("product dialog supports Escape and restores focus to its trigger", async () => {
  const source = await readFile(catalogPath, "utf8");

  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /closeButtonRef\.current\?\.focus\(\)/);
  assert.match(source, /lastFocusedTriggerRef\.current\?\.focus\(\)/);
});

test("catalog categories implement the tab keyboard pattern", async () => {
  const source = await readFile(catalogPath, "utf8");

  assert.match(source, /onKeyDown=/);
  assert.match(source, /aria-controls=/);
  assert.match(source, /role="tabpanel"/);
  assert.match(source, /ArrowRight/);
});

test("removes the unused legacy product hero", async () => {
  await assert.rejects(
    access(resolve(process.cwd(), "features/products/components/ProductHero.tsx")),
  );
});
