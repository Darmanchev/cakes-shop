import type { CartItem } from './cart.types';

export function isValidCartItem(item: CartItem) {
  return item.productId.trim().length > 0 && Number.isInteger(item.quantity) && item.quantity > 0;
}
