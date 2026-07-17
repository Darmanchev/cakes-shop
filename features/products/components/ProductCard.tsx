'use client';

import Image from 'next/image';
import { Clock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import { formatPrice } from '@/lib/utils/format-price';
import type { Product } from '../product.types';

export function ProductCard({ product }: { product: Product }) {
  const { language, t } = useLanguage();
  const productCopy = t.products[product.id] ?? product;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={productCopy.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-grow flex-col space-y-4 p-5">
        <div>
          <p className="text-sm text-rose-700">{t.productCard.categories[product.category]}</p>
          <h3 className="mt-1 text-xl font-semibold text-stone-950">{productCopy.name}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-600">{productCopy.description}</p>
        </div>

        <div className="grid gap-2 text-sm text-stone-700">
          {productCopy.weight ? <p>{productCopy.weight}</p> : null}
          {productCopy.filling ? <p>{productCopy.filling}</p> : null}
          <p className="flex items-center gap-2">
            <Clock size={16} aria-hidden="true" />
            {productCopy.prepTime}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-stone-100 pt-4">
          <p className="text-lg font-semibold text-stone-950">
            {t.productCard.from} {formatPrice(product.priceMinor, language)}
          </p>
          <a
            href="#order"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-rose-700 px-4 text-sm font-medium text-white transition hover:bg-rose-800"
          >
            <ShoppingBag size={17} aria-hidden="true" />
            {t.productCard.order}
          </a>
        </div>
      </div>
    </article>
  );
}
