import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { translations } from "@/lib/i18n";
import { filterProductsByCategory, products } from "./product.data";
import { productCategories } from "./product.schema";

test("uses transparent cutout images for every product", async () => {
  const images = products
    .map(({ id, image }) => ({ id, image }));

  assert.deepEqual(images, [
    {
      id: "cake-1",
      image: "/images/products/cakes/napoleon-cutout.png",
    },
    { id: "cake-2", image: "/images/products/cakes/milk-girl-cutout.png" },
    { id: "cake-3", image: "/images/products/cakes/medovik-cutout.png" },
    { id: "cake-4", image: "/images/products/cakes/waffle-cake-cutout.png" },
    { id: "cake-5", image: "/images/products/cakes/meringue-roll-cutout.png" },
    {
      id: "cin-1",
      image: "/images/products/cinnabons/classic-cinnabon-cutout.png",
    },
    {
      id: "cin-2",
      image: "/images/products/cinnabons/poppy-seed-cinnabon-cutout.png",
    },
    {
      id: "muffin-1",
      image: "/images/products/muffins/baba-neagra-cutout.png",
    },
    {
      id: "muffin-2",
      image: "/images/products/muffins/blueberry-muffins-cutout.png",
    },
  ]);

  for (const { image } of images) {
    const metadata = await sharp(resolve(process.cwd(), `public${image}`)).metadata();

    assert.equal(metadata.hasAlpha, true, `${image} must have transparency`);
  }
});

test("lists the meringue roulade as a cake and provides Milk Girl copy", () => {
  const roulade = products.find((product) => product.id === "cake-5");

  assert.equal(roulade?.category, "cakes");
  assert.equal(translations.ru.products["cake-2"]?.name, "Молочная девочка");
  assert.match(
    translations.ru.products["cake-2"]?.description ?? "",
    /молочных коржей/,
  );
});

test("publishes the active cakes, cinnabons, and muffins", () => {
  assert.deepEqual(
    products.map((product) => product.id),
    [
      "cake-1",
      "cake-2",
      "cake-3",
      "cake-4",
      "cake-5",
      "cin-1",
      "cin-2",
      "muffin-1",
      "muffin-2",
    ],
  );
});

test("offers both muffins for two euro in every language", () => {
  const muffins = filterProductsByCategory(products, "muffins");

  assert.deepEqual(productCategories, ["cakes", "cinnabons", "muffins"]);
  assert.deepEqual(
    muffins.map(({ id, priceMinor }) => ({ id, priceMinor })),
    [
      { id: "muffin-1", priceMinor: 200 },
      { id: "muffin-2", priceMinor: 200 },
    ],
  );
  assert.equal(translations.bg.catalog.sections.muffins, "Мъфини");
  assert.equal(translations.en.catalog.sections.muffins, "Muffins");
  assert.equal(translations.ru.catalog.sections.muffins, "Маффины");
});

test("filters the catalog to the selected category without changing product order", () => {
  assert.deepEqual(
    filterProductsByCategory(products, "cinnabons").map((product) => product.id),
    ["cin-1", "cin-2"],
  );

  assert.deepEqual(
    filterProductsByCategory(products, "cakes").map((product) => product.id),
    ["cake-1", "cake-2", "cake-3", "cake-4", "cake-5"],
  );

  assert.deepEqual(
    filterProductsByCategory(products, "muffins").map((product) => product.id),
    ["muffin-1", "muffin-2"],
  );
});
