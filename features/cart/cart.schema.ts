import type { Cart, CartItem } from "./cart.types";

export const MAX_CART_ITEMS = 10;
export const MAX_CART_ITEM_QUANTITY = 20;

export function isValidCartItem(item: CartItem) {
  return (
    typeof item?.productId === "string" &&
    item.productId.trim().length > 0 &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0 &&
    item.quantity <= MAX_CART_ITEM_QUANTITY &&
    typeof item.comment === "string" &&
    item.comment.length <= 500
  );
}

export function parseStoredCart(value: unknown): Cart {
  if (
    !value ||
    typeof value !== "object" ||
    !("items" in value) ||
    !Array.isArray(value.items)
  ) {
    return { items: [] };
  }

  const productIds = new Set<string>();
  const items = value.items
    .filter((item): item is CartItem => {
      if (
        !isValidCartItem(item as CartItem) ||
        productIds.has((item as CartItem).productId)
      ) {
        return false;
      }

      productIds.add((item as CartItem).productId);
      return true;
    })
    .slice(0, MAX_CART_ITEMS);

  return { items };
}
