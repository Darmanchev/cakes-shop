import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "../language/LanguageProvider";
import { StorefrontFooter } from "./StorefrontFooter";

test("footer links lead to implemented pages or homepage sections", () => {
  const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(StorefrontFooter)));
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
  const destinations = new Set(["/", "/products", "/#collections", "/#about", "/order"]);
  assert.ok(links.length > 0);
  for (const href of links) assert.ok(destinations.has(href), `Invalid footer destination: ${href}`);
  assert.doesNotMatch(html, /555.*123-4567|123 Dessert Lane/);
});
