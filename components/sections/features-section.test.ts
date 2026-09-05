import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("uses Lucide's available dessert icon for freshly baked features", async () => {
  const source = await readFile(
    resolve(process.cwd(), "components/sections/FeaturesSection.tsx"),
    "utf8",
  );

  assert.match(source, /import \{ Dessert, Leaf \} from "lucide-react"/);
  assert.match(source, /<Dessert size=\{32\} strokeWidth=\{1\.5\} \/>/);
  assert.doesNotMatch(source, /Cupcake/);
});
