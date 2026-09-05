import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("keeps the hero cake fully visible and uses fluid layout sizing", async () => {
  const catalogSource = await readFile(
    resolve(process.cwd(), "features/products/components/CatalogContent.tsx"),
    "utf8",
  );
  const homeSource = await readFile(resolve(process.cwd(), "app/page.tsx"), "utf8");

  assert.match(catalogSource, /object-contain object-center/);
  assert.match(catalogSource, /top-0/);
  assert.match(homeSource, /max-w-\[min\(96vw,1800px\)\]/);
});

test("places product titles over the image and enlarges it on hover", async () => {
  const cardSource = await readFile(
    resolve(process.cwd(), "features/products/components/ProductCard.tsx"),
    "utf8",
  );

  assert.match(cardSource, /group-hover:scale-\[1\.06\]/);
  assert.match(cardSource, /absolute left-4 top-4/);
  assert.match(cardSource, /productCopy\.name/);
});
