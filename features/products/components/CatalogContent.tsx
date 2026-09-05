"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  CakeSlice,
  ChevronLeft,
  ChevronRight,
  Croissant,
  Dessert,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { QuantitySelector } from "@/features/cart/components/QuantitySelector";
import { useCart } from "@/features/cart/CartProvider";
import { formatPrice } from "@/lib/utils/format-price";
import { ProductCard } from "./ProductCard";
import type { Category, Product } from "../product.types";

interface CatalogContentProps {
  productsByCategory: Record<Category, Product[]>;
}

const categoryIcons = {
  cakes: CakeSlice,
  cinnabons: Croissant,
  muffins: Dessert,
} satisfies Record<Category, typeof CakeSlice>;

export function CatalogContent({ productsByCategory }: CatalogContentProps) {
  const { language, t } = useLanguage();
  const { items, canAddProduct, addItem, setQuantity, decrementItem, removeItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<Category>("cakes");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const visibleProducts = productsByCategory[activeCategory];
  const selectedCartItem = selectedProduct
    ? items.find((item) => item.productId === selectedProduct.id)
    : undefined;

  function scrollProducts(direction: -1 | 1) {
    railRef.current?.scrollBy({
      left: direction * Math.max(260, railRef.current.clientWidth * 0.72),
      behavior: "smooth",
    });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5 pb-2.5 sm:gap-3 sm:pb-3 lg:pb-4">
      <section className="relative z-10 mb-[clamp(1.25rem,3vh,2.25rem)] h-[clamp(190px,30vh,340px)] shrink-0">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[clamp(0.25rem,1vh,0.75rem)] overflow-hidden" aria-hidden="true">
          <Image
            src="/images/hero/pink-brush-stroke.png"
            alt=""
            fill
            priority
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="scale-x-[1.04] object-fill brightness-[0.78] saturate-[0.88]"
          />
          <div className="painted-hero__texture absolute inset-0 opacity-45" />
        </div>

        <div className="pointer-events-none absolute bottom-0 top-0 -right-[12%] z-20 w-[76%] min-[480px]:-right-[5%] min-[480px]:w-[66%] sm:right-[1%] sm:w-[57%] lg:right-[3%] lg:w-[54%]">
          <Image
            src="/images/hero/berry-cake-cutout.png"
            alt={t.hero.imageAlt}
            fill
            priority
            sizes="(max-width: 640px) 78vw, 58vw"
            className="object-contain object-center drop-shadow-[0_22px_22px_rgba(68,53,48,0.24)]"
          />
        </div>

        <div className="relative z-30 flex h-full max-w-[64%] flex-col justify-center px-[clamp(1.25rem,4vw,2.75rem)] pb-5 pt-3 text-[#fffaf5] sm:max-w-[53%]">
          <p className="mb-2 hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f7e5df] min-[440px]:flex">
            <Sparkles size={13} aria-hidden="true" />
            {t.hero.badge}
          </p>
          <h1 className="font-display max-w-lg text-[clamp(1.6rem,3.2vw,3rem)] font-medium leading-[1.02] tracking-[-0.045em]">
            {t.hero.title}
          </h1>
          <p className="mt-3 hidden max-w-[430px] text-xs leading-5 text-[#fff5ef]/90 md:block lg:text-sm">
            {t.hero.description}
          </p>
        </div>
      </section>

      <section id="catalog" className="flex min-h-0 flex-1 flex-col px-3 sm:px-5 lg:px-6">
        <div className="mb-2.5 flex shrink-0 justify-center sm:mb-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-label={t.catalog.title}>
            {(Object.keys(productsByCategory) as Category[]).map((category) => {
              const Icon = categoryIcons[category] ?? Sparkles;
              const active = category === activeCategory;

              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setActiveCategory(category);
                    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                  className={`inline-flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-bold transition sm:h-11 sm:px-4 sm:text-sm ${
                    active
                      ? "border-[#b78e8c] bg-[#e3c5cb] text-[#443530] shadow-sm"
                      : "border-[#dfcec7] bg-white/55 text-[#765f58] hover:bg-white"
                  }`}
                >
                  <Icon size={17} aria-hidden="true" />
                  <span className="hidden min-[390px]:inline">
                    {t.catalog.sections[category]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="group/rail relative min-h-0 flex-1">
          <div
            ref={railRef}
            className="no-scrollbar grid h-full snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-0.5 sm:auto-cols-[44%] lg:auto-cols-[31.5%]"
            aria-live="polite"
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>

          {visibleProducts.length > 3 ? (
            <>
              <button
                type="button"
                onClick={() => scrollProducts(-1)}
                className="absolute left-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#fffaf5]/95 text-[#443530] shadow-[0_10px_24px_rgba(68,53,48,0.2)] backdrop-blur transition hover:scale-105 hover:bg-white sm:flex lg:left-3 lg:size-12"
                aria-label="Previous products"
              >
                <ChevronLeft size={21} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollProducts(1)}
                className="absolute right-2 top-1/2 z-20 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#443530] bg-[#443530] text-white shadow-[0_10px_24px_rgba(68,53,48,0.28)] transition hover:scale-105 hover:bg-[#5a4540] sm:flex lg:right-3 lg:size-12"
                aria-label="Next products"
              >
                <ChevronRight size={21} aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>
      </section>

      {selectedProduct ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#443530]/45 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setSelectedProduct(null);
            }
          }}
        >
          <article
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-dialog-title"
            className="relative grid max-h-[88dvh] w-full max-w-[760px] overflow-auto rounded-[28px] border border-white/60 bg-[#fffaf5] p-3 shadow-2xl sm:grid-cols-[0.9fr_1.1fr] sm:p-4"
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute right-5 top-5 z-10 inline-flex size-9 items-center justify-center rounded-full bg-white/90 text-[#443530] shadow-md"
              aria-label="Close"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div className="relative min-h-56 overflow-hidden rounded-[22px] bg-[#eaded7] sm:min-h-[390px]">
              <Image
                src={selectedProduct.image}
                alt={t.products[selectedProduct.id]?.name ?? selectedProduct.name}
                fill
                sizes="(max-width: 640px) 100vw, 380px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col p-4 sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a07777]">
                {t.productCard.categories[selectedProduct.category]}
              </p>
              <h3 id="product-dialog-title" className="font-display mt-2 text-3xl font-semibold leading-tight tracking-[-0.035em]">
                {t.products[selectedProduct.id]?.name ?? selectedProduct.name}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#715d56]">
                {t.products[selectedProduct.id]?.description ?? selectedProduct.description}
              </p>
              <div className="mt-5 grid gap-2 rounded-[18px] bg-[#f5e8e3] p-4 text-sm text-[#604d47]">
                {t.products[selectedProduct.id]?.weight ?? selectedProduct.weight ? (
                  <p>{t.products[selectedProduct.id]?.weight ?? selectedProduct.weight}</p>
                ) : null}
                {t.products[selectedProduct.id]?.filling ?? selectedProduct.filling ? (
                  <p>{t.products[selectedProduct.id]?.filling ?? selectedProduct.filling}</p>
                ) : null}
                <p>{t.products[selectedProduct.id]?.prepTime ?? selectedProduct.prepTime}</p>
              </div>
              <p className="font-display mt-5 text-2xl font-semibold text-[#8d6264]">
                {t.productCard.from} {formatPrice(selectedProduct.priceMinor, language)}
              </p>
              <div className="mt-auto pt-5">
                {selectedCartItem ? (
                  <QuantitySelector
                    productName={t.products[selectedProduct.id]?.name ?? selectedProduct.name}
                    quantity={selectedCartItem.quantity}
                    onChange={(quantity) => setQuantity(selectedProduct.id, quantity)}
                    onDecrement={() => decrementItem(selectedProduct.id)}
                    onRemove={() => removeItem(selectedProduct.id)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => addItem(selectedProduct.id)}
                    disabled={!canAddProduct}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#443530] px-5 text-sm font-semibold text-white transition hover:bg-[#60483f] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t.productCard.add}
                  </button>
                )}
                {selectedCartItem ? (
                  <Link
                    href="/order"
                    className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full border border-[#cfb7b1] text-sm font-semibold text-[#443530] transition hover:bg-[#f5e8e3]"
                  >
                    {t.hero.orderCta}
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </div>
  );
}
