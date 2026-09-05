import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "@/components/language/LanguageProvider";
import { CartProvider } from "@/features/cart/CartProvider";
import { CatalogContent } from "./components/CatalogContent";

test("keeps catalog navigation off the homepage hero", () => {
  const markup = renderToStaticMarkup(
    createElement(
      LanguageProvider,
      null,
      createElement(
        CartProvider,
        null,
        createElement(CatalogContent, {
          productsByCategory: { cakes: [], cinnabons: [], muffins: [] },
        }),
      ),
    ),
  );

  assert.doesNotMatch(markup, /href="#catalog"/);
  assert.doesNotMatch(markup, /Прясно приготвено/);
  assert.doesNotMatch(markup, /Качествени съставки/);
});
