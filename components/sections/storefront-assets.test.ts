import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

const root = process.cwd();

test("provides responsive image sizes and localized alternative text", async () => {
  const [hero, categories, story] = await Promise.all([
    readFile(resolve(root, "components/sections/HeroSection.tsx"), "utf8"),
    readFile(
      resolve(root, "components/sections/CategoryCardsSection.tsx"),
      "utf8",
    ),
    readFile(resolve(root, "components/sections/StorySection.tsx"), "utf8"),
  ]);

  assert.match(hero, /sizes=/);
  assert.match(hero, /alt=\{t\.hero\.imageAlt\}/);
  assert.match(categories, /sizes=/);
  assert.match(story, /sizes=/);
  assert.match(story, /alt=\{t\.story\.imageAlt\}/);
});

test("loads Latin and Cyrillic storefront font subsets", async () => {
  const layout = await readFile(resolve(root, "app/layout.tsx"), "utf8");
  assert.equal(layout.match(/subsets: \["latin", "cyrillic"\]/g)?.length, 2);
});

test("removes source modules with no consumers", async () => {
  for (const file of [
    "features/orders/order.actions.ts",
    "features/products/product.actions.ts",
    "features/orders/components/OrderStepsSection.tsx",
    "features/products/components/CareSection.tsx",
    "components/ui/InfoCard.tsx",
  ]) {
    await assert.rejects(access(resolve(root, file)));
  }
});
