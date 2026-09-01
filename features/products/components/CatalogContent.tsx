"use client";

import { useLanguage } from "@/components/language/LanguageProvider";
import { ProductCard } from "./ProductCard";
import type { Category, Product } from "../product.types";

interface CatalogContentProps {
  productsByCategory: Pick<Record<Category, Product[]>, "cakes" | "cinnabons">;
}

export function CatalogContent({ productsByCategory }: CatalogContentProps) {
  const { t } = useLanguage();

  return (
    <section id="catalog" className="bg-[#fcf9f5] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a695a]">
              {t.catalog.title}
            </p>
            <h2 className="font-display mt-1 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
              {t.catalog.sections.cakes}
            </h2>
          </div>
          <a
            href="#order"
            className="mb-1 hidden text-sm font-medium text-[#7c1028] transition hover:text-[#5d0a1d] sm:inline-flex"
          >
            {t.hero.orderCta}{" "}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <ProductSection products={productsByCategory.cakes} />
        <ProductSection
          title={t.catalog.sections.cinnabons}
          products={productsByCategory.cinnabons}
        />
      </div>
    </section>
  );
}

function ProductSection({
  title,
  products,
}: {
  title?: string;
  products: Product[];
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 first:mt-8 sm:mt-14">
      {title ? (
        <h3 className="font-display mb-5 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
          {title}
        </h3>
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
