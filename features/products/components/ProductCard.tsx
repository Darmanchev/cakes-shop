'use client';

import Image from 'next/image';
import { Clock, ShoppingBag } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import { useCart } from '@/features/cart/CartProvider';
import { QuantitySelector } from '@/features/cart/components/QuantitySelector';
import { formatPrice } from '@/lib/utils/format-price';
import type { Product } from '../product.types';

export function ProductCard({ product }: { product: Product }) {
  const { language, t } = useLanguage();
  const { items, canAddProduct, addItem, setQuantity, removeItem } = useCart();
  const productCopy = t.products[product.id] ?? product;
  const cartItem = items.find((item) => item.productId === product.id);

  return (
    <article className={`flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition ${cartItem ? 'border-rose-300 ring-2 ring-rose-100' : 'border-stone-200'}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={product.image}
          alt={productCopy.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-grow flex-col space-y-4 p-4 sm:p-5">
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

        <div className="mt-auto flex flex-col items-stretch gap-3 border-t border-stone-100 pt-4 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
          <p className="text-lg font-semibold text-stone-950">
            {t.productCard.from} {formatPrice(product.priceMinor, language)}
          </p>
          {cartItem ? (
            <QuantitySelector
              productName={productCopy.name}
              quantity={cartItem.quantity}
              onChange={(quantity) => setQuantity(product.id, quantity)}
              onRemove={() => removeItem(product.id)}
              className="w-full min-[380px]:w-auto"
            />
          ) : (
            <button
              type="button"
              onClick={() => addItem(product.id)}
              disabled={!canAddProduct}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-800 bg-white px-5 text-sm font-semibold text-stone-950 transition hover:border-rose-700 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              title={!canAddProduct ? t.productCard.limitReached : undefined}
            >
              <ShoppingBag size={17} aria-hidden="true" />
              {t.productCard.add}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
