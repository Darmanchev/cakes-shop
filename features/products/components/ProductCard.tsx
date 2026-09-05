"use client";

import Image from "next/image";
import { Clock, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useCart } from "@/features/cart/CartProvider";
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
};

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { items, canAddProduct, addItem } = useCart();
  const productCopy = t.products[product.id] ?? product;
  const cartItem = items.find((item) => item.productId === product.id);
  const canAdd = Boolean(cartItem) || canAddProduct;

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
          className="object-contain p-4 drop-shadow-[0_12px_12px_rgba(73,49,43,0.2)] transition duration-500 group-hover:scale-[1.035] sm:p-5"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#fffaf5]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#765b58] shadow-sm backdrop-blur sm:left-4 sm:top-4">
          {t.productCard.categories[product.category]}
        </span>
      </button>

      <div className="grid min-h-[92px] shrink-0 grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1.5 p-3.5 sm:min-h-[98px] sm:p-4">
        <button type="button" onClick={onViewDetails} className="min-w-0 text-left">
          <h3 className="font-display line-clamp-1 text-lg font-semibold leading-tight tracking-[-0.025em] text-[#443530] sm:text-xl">
            {productCopy.name}
          </h3>
        </button>

        <p className="font-display text-lg font-semibold text-[#8d6264] sm:text-xl">
          {formatPrice(product.priceMinor, language)}
        </p>

        <p className="flex min-w-0 items-center gap-1.5 truncate text-[10px] font-medium text-[#765b58] sm:text-[11px]">
          <Clock size={12} aria-hidden="true" />
          {productCopy.prepTime}
        </p>

        <button
          type="button"
          onClick={() => addItem(product.id)}
          disabled={!canAdd}
          className={`relative inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-bold transition hover:bg-[#443530] hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-9 sm:text-xs ${
            cartItem
              ? "border-[#443530] bg-[#443530] text-white"
              : "border-[#bfa6a0] bg-[#fffaf5] text-[#443530]"
          }`}
          title={!canAdd ? t.productCard.limitReached : t.productCard.add}
        >
          <ShoppingBag size={14} aria-hidden="true" />
          {cartItem ? cartItem.quantity : t.productCard.add}
        </button>
      </div>
    </article>
  );
}
