import type { Cart } from "./cart.types";
import { MAX_CART_ITEMS, MAX_CART_ITEM_QUANTITY } from "./cart.schema";

export function getCartItemsCount(cart: Cart) {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

export function addCartItem(cart: Cart, productId: string): Cart {
  const existingItem = cart.items.find((item) => item.productId === productId);

  if (existingItem) {
    return setCartItemQuantity(cart, productId, existingItem.quantity + 1);
  }

  if (cart.items.length >= MAX_CART_ITEMS) {
    return cart;
  }

  return {
    items: [...cart.items, { productId, quantity: 1, comment: "" }],
  };
}

export function setCartItemQuantity(
  cart: Cart,
  productId: string,
  quantity: number,
): Cart {
  if (!Number.isInteger(quantity)) {
    return cart;
  }

  const nextQuantity = Math.min(MAX_CART_ITEM_QUANTITY, Math.max(1, quantity));

  return {
    items: cart.items.map((item) =>
      item.productId === productId ? { ...item, quantity: nextQuantity } : item,
    ),
  };
}

export function removeCartItem(cart: Cart, productId: string): Cart {
  return {
    items: cart.items.filter((item) => item.productId !== productId),
  };
}

export function updateCartItemComment(
  cart: Cart,
  productId: string,
  comment: string,
): Cart {
  return {
    items: cart.items.map((item) =>
      item.productId === productId
        ? { ...item, comment: comment.slice(0, 500) }
        : item,
    ),
  };
}
