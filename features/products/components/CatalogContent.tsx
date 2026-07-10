'use client';

import { useLanguage } from '@/components/language/LanguageProvider';
import { ProductCard } from './ProductCard';
import type { Category, Product } from '../product.types';

interface CatalogContentProps {
  productsByCategory: Record<Category, Product[]>;
}

export function CatalogContent({ productsByCategory }: CatalogContentProps) {
  const { t } = useLanguage();

  return (
    <section id="catalog" className="bg-white py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold sm:text-4xl">{t.catalog.title}</h2>
          <p className="mt-3 text-stone-700">{t.catalog.description}</p>
        </div>

        <ProductSection title={t.catalog.sections.cakes} products={productsByCategory.cakes} />
        <ProductSection title={t.catalog.sections.cinnabons} products={productsByCategory.cinnabons} />
        <ProductSection title={t.catalog.sections.combos} products={productsByCategory.combos} />
      </div>
    </section>
  );
}

function ProductSection({ title, products }: { title: string; products: Product[] }) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
