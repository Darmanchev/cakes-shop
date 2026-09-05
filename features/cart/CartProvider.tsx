"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  decrementCartItem,
  getCartItemsCount,
  removeCartItem,
  setCartItemQuantity,
  updateCartItemComment,
} from "./cart.service";
import { MAX_CART_ITEMS, parseStoredCart } from "./cart.schema";
import type { Cart, CartItem } from "./cart.types";

const CART_STORAGE_KEY = "stas-cakes-cart";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  canAddProduct: boolean;
  addItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateComment: (productId: string, comment: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    queueMicrotask(() => {
      if (!active) {
        return;
      }

      try {
        const storedValue = window.localStorage.getItem(CART_STORAGE_KEY);
        setCart(
          storedValue
            ? parseStoredCart(JSON.parse(storedValue))
            : { items: [] },
        );
      } catch {
        setCart({ items: [] });
      } finally {
        setStorageLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (storageLoaded) {
      try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch {
        // The cart remains usable in memory when storage is unavailable.
      }
    }
  }, [cart, storageLoaded]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: cart.items,
      totalItems: getCartItemsCount(cart),
      canAddProduct: cart.items.length < MAX_CART_ITEMS,
      addItem: (productId) =>
        setCart((current) => addCartItem(current, productId)),
      decrementItem: (productId) =>
        setCart((current) => decrementCartItem(current, productId)),
      setQuantity: (productId, quantity) =>
        setCart((current) => setCartItemQuantity(current, productId, quantity)),
      removeItem: (productId) =>
        setCart((current) => removeCartItem(current, productId)),
      updateComment: (productId, comment) =>
        setCart((current) =>
          updateCartItemComment(current, productId, comment),
        ),
      clearCart: () => setCart({ items: [] }),
    }),
    [cart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
