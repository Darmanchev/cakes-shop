'use client';

import { MapPin } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import type { Product } from '@/features/products/product.types';
import { OrderForm } from './OrderForm';

export function OrderContent({
  products,
  turnstileSiteKey,
}: {
  products: Product[];
  turnstileSiteKey?: string;
}) {
  const { t } = useLanguage();

  return (
    <section id="order" className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1fr]">
      <div>
        <h2 className="text-3xl font-bold sm:text-4xl">{t.order.title}</h2>
        <p className="mt-3 leading-7 text-stone-700">{t.order.description}</p>
        <p className="mt-6 flex items-center gap-2 text-sm text-stone-700">
          <MapPin size={17} aria-hidden="true" />
          {t.order.deliveryNote}
        </p>
      </div>

      <OrderForm products={products} turnstileSiteKey={turnstileSiteKey} />
    </section>
  );
}
