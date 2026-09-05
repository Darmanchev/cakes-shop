import assert from "node:assert/strict";
import test from "node:test";
import { translations } from "@/lib/i18n";
import { filterProductsByCategory, products } from "./product.data";

test("uses transparent cutout images for every product", () => {
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
  ]);
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

test("publishes only the active cakes and cinnabons", () => {
  assert.deepEqual(
    products.map((product) => product.id),
    ["cake-1", "cake-2", "cake-3", "cake-4", "cake-5", "cin-1", "cin-2"],
  );
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
});
