import assert from "node:assert/strict";
import test from "node:test";
import { translations } from "@/lib/i18n";
import { products } from "./product.data";

test("publishes the requested cake lineup with the generated café images", () => {
  const cakes = products
    .filter((product) => product.category === "cakes")
    .map(({ id, image }) => ({ id, image }));

  assert.deepEqual(cakes, [
    {
      id: "cake-1",
      image: "/products/cake_napoleon_with_fruits-cafe-bokeh.png",
    },
    { id: "cake-2", image: "/products/cake_white_hyinea-cafe-bokeh.png" },
    { id: "cake-3", image: "/products/cake_medovic-cafe-bokeh.png" },
    { id: "cake-4", image: "/products/cake_nuts-cafe-bokeh.png" },
    { id: "cake-5", image: "/products/rulet-cafe-bokeh.png" },
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
