import type { Cart } from './cart.types';

export function getCartItemsCount(cart: Cart) {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
