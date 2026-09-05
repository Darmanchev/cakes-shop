import assert from "node:assert/strict";
import test from "node:test";
import {
  addCartItem,
  decrementCartItem,
  getCartItemsCount,
  removeCartItem,
  setCartItemQuantity,
  updateCartItemComment,
} from "./cart.service";
import { parseStoredCart } from "./cart.schema";

test("adds products and updates their quantity", () => {
  const withProduct = addCartItem({ items: [] }, "cake-1");
  const withTwoProducts = addCartItem(withProduct, "cin-1");
  const updated = setCartItemQuantity(withTwoProducts, "cake-1", 3);

  assert.deepEqual(updated.items, [
    { productId: "cake-1", quantity: 3, comment: "" },
    { productId: "cin-1", quantity: 1, comment: "" },
  ]);
  assert.equal(getCartItemsCount(updated), 4);
});

test("limits quantity and supports comments and removal", () => {
  const cart = addCartItem({ items: [] }, "cake-1");
  const limited = setCartItemQuantity(cart, "cake-1", 30);
  const commented = updateCartItemComment(limited, "cake-1", "Без орехов");
  const removed = removeCartItem(commented, "cake-1");

  assert.equal(limited.items[0].quantity, 20);
  assert.equal(commented.items[0].comment, "Без орехов");
  assert.deepEqual(removed, { items: [] });
});

test("decrements quantity and removes the item when it reaches zero", () => {
  const cart = setCartItemQuantity(
    addCartItem({ items: [] }, "cake-1"),
    "cake-1",
    2,
  );

  const decremented = decrementCartItem(cart, "cake-1");
  const removed = decrementCartItem(decremented, "cake-1");

  assert.equal(decremented.items[0]?.quantity, 1);
  assert.deepEqual(removed, { items: [] });
});

test("rejects invalid persisted cart data", () => {
  const parsed = parseStoredCart({
    items: [
      { productId: "cake-1", quantity: 2, comment: "" },
      { productId: "cake-1", quantity: 4, comment: "" },
      { productId: "", quantity: 1, comment: "" },
      { productId: "cin-1", quantity: 21, comment: "" },
    ],
  });

  assert.deepEqual(parsed.items, [
    { productId: "cake-1", quantity: 2, comment: "" },
  ]);
});
