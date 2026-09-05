import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QuantityStepper } from "./components/QuantityStepper";

test("renders adjacent decrease and increase controls in one stepper", () => {
  const markup = renderToStaticMarkup(
    createElement(QuantityStepper, {
      productName: "Napoleon",
      decreaseLabel: "Decrease",
      increaseLabel: "Increase",
      onDecrement: () => undefined,
      onIncrement: () => undefined,
    }),
  );

  assert.match(markup, /data-quantity-stepper="true"/);
  assert.match(
    markup,
    /aria-label="Decrease Napoleon"[\s\S]*aria-label="Increase Napoleon"/,
  );
});
