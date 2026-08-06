'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import { MAX_CART_ITEM_QUANTITY } from '../cart.schema';

interface QuantitySelectorProps {
  productName: string;
  quantity: number;
  onChange: (quantity: number) => void;
  onRemove: () => void;
  className?: string;
}

export function QuantitySelector({
  productName,
  quantity,
  onChange,
  onRemove,
  className = '',
}: QuantitySelectorProps) {
  const { t } = useLanguage();

  return (
    <div className={`flex h-12 min-w-0 items-center gap-2 rounded-full bg-rose-50 p-1.5 ${className}`}>
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-900 transition hover:border-rose-700 hover:text-rose-700"
        aria-label={`${t.productCard.remove} ${productName}`}
        title={t.productCard.remove}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>

      <input
        type="number"
        min={1}
        max={MAX_CART_ITEM_QUANTITY}
        value={quantity}
        onChange={(event) => {
          const nextQuantity = event.target.valueAsNumber;

          if (Number.isInteger(nextQuantity)) {
            onChange(nextQuantity);
          }
        }}
        onBlur={(event) => {
          if (!Number.isInteger(event.currentTarget.valueAsNumber)) {
            event.currentTarget.value = String(quantity);
          }
        }}
        className="h-9 w-12 rounded-md border border-stone-200 bg-white px-1 text-center font-semibold outline-none focus:border-rose-700"
        aria-label={`${t.productCard.quantity}: ${productName}`}
      />
      <span className="shrink-0 text-sm font-semibold text-stone-800">{t.productCard.pieces}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={quantity >= MAX_CART_ITEM_QUANTITY}
        className="ml-auto inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-rose-700 text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`${t.productCard.increase} ${productName}`}
        title={t.productCard.increase}
      >
        <Plus size={21} aria-hidden="true" />
      </button>
    </div>
  );
}
