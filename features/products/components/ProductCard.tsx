"use client";

import Image from "next/image";
import { Clock, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useCart } from "@/features/cart/CartProvider";
import { MAX_CART_ITEM_QUANTITY } from "@/features/cart/cart.schema";
import { QuantityStepper } from "@/features/cart/components/QuantityStepper";
import { formatPrice } from "@/lib/utils/format-price";
import type { Product } from "../product.types";

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
}

const productBackgrounds: Record<string, string> = {
  "cake-1": "#edc7cd",
  "cake-2": "#efdcd0",
  "cake-3": "#d8c8d8",
  "cake-4": "#efdcd0",
  "cake-5": "#edc7cd",
  "cin-1": "#d8c8d8",
  "cin-2": "#efdcd0",
  "muffin-1": "#edc7cd",
  "muffin-2": "#d8c8d8",
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { items, canAddProduct, addItem, decrementItem } = useCart();
  const productCopy = t.products[product.id] ?? product;
  const cartItem = items.find((item) => item.productId === product.id);

  return (
    <article
      className={`group flex h-full min-h-0 snap-start flex-col overflow-hidden rounded-[22px] border bg-white/75 shadow-[0_10px_26px_rgba(91,69,62,0.08)] transition duration-300 sm:rounded-[26px] ${
        cartItem
          ? "border-[#b78e8c] ring-2 ring-[#ead0d4]"
          : "border-white/80 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(91,69,62,0.13)]"
      }`}
    >
      <button
        type="button"
        onClick={onViewDetails}
        className="relative min-h-0 flex-1 overflow-hidden text-left"
        style={{ backgroundColor: productBackgrounds[product.id] ?? "#edc7cd" }}
        aria-label={productCopy.name}
      >
        <Image
          src={product.image}
          alt={productCopy.name}
          fill
          loading="eager"
          sizes="(max-width: 640px) 84vw, (max-width: 1024px) 44vw, 390px"
          className="object-contain p-5 drop-shadow-[0_12px_12px_rgba(73,49,43,0.2)] transition duration-500 ease-out group-hover:scale-[1.06] sm:p-6"
        />
        <h3 className="font-display absolute left-4 top-4 max-w-[72%] text-[clamp(1.05rem,1.6vw,1.45rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-[#443530] drop-shadow-[0_1px_0_rgba(255,255,255,0.35)] sm:left-5 sm:top-5">
          {productCopy.name}
        </h3>
      </button>

      <div className="grid min-h-[70px] shrink-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 p-3 sm:min-h-[76px] sm:p-3.5">
        <p className="font-display text-lg font-semibold text-[#8d6264] sm:text-xl">
          {formatPrice(product.priceMinor, language)}
        </p>

        <p className="flex min-w-0 items-center gap-1.5 truncate text-[10px] font-medium text-[#765b58] sm:text-[11px]">
          <Clock size={12} aria-hidden="true" />
          {productCopy.prepTime}
        </p>

        {cartItem ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#f2e1e2] p-0.5 pl-2.5">
            <span className="min-w-4 text-center text-xs font-bold text-[#443530]">
              {cartItem.quantity}
            </span>
            <QuantityStepper
              productName={productCopy.name}
              decreaseLabel={t.productCard.decrease}
              increaseLabel={t.productCard.increase}
              onDecrement={() => decrementItem(product.id)}
              onIncrement={() => addItem(product.id)}
              disableIncrement={cartItem.quantity >= MAX_CART_ITEM_QUANTITY}
              className="border-0"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(product.id)}
            disabled={!canAddProduct}
            className="relative inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-[#bfa6a0] bg-[#fffaf5] px-3 text-[11px] font-bold text-[#443530] transition hover:bg-[#443530] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:text-xs"
            title={!canAddProduct ? t.productCard.limitReached : t.productCard.add}
          >
            <ShoppingBag size={14} aria-hidden="true" />
            {t.productCard.add}
          </button>
        )}
      </div>
    </article>
  );
}
