import assert from "node:assert/strict";
import test from "node:test";
import { translations } from "@/lib/i18n";
import { products } from "./product.data";

test("uses stable category-based paths for cake images", () => {
  const cakes = products
    .filter((product) => product.category === "cakes")
    .map(({ id, image }) => ({ id, image }));

  assert.deepEqual(cakes, [
    {
      id: "cake-1",
      image: "/images/products/cakes/napoleon.png",
    },
    { id: "cake-2", image: "/images/products/cakes/milk-girl.png" },
    { id: "cake-3", image: "/images/products/cakes/medovik.png" },
    { id: "cake-4", image: "/images/products/cakes/waffle-cake.png" },
    { id: "cake-5", image: "/images/products/cakes/meringue-roll.png" },
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
