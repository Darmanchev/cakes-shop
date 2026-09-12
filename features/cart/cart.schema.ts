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
  const items: CartItem[] = [];

  for (const valueItem of value.items) {
    if (!isValidCartItem(valueItem as CartItem)) {
      continue;
    }

    const item = valueItem as CartItem;
    const productId = item.productId.trim();

    if (productIds.has(productId)) {
      continue;
    }

    productIds.add(productId);
    items.push({ ...item, productId });

    if (items.length === MAX_CART_ITEMS) {
      break;
    }
  }

  return { items };
}
