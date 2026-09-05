"use client";

import { Trash2 } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { MAX_CART_ITEM_QUANTITY } from "../cart.schema";
import { QuantityStepper } from "./QuantityStepper";

interface QuantitySelectorProps {
  productName: string;
  quantity: number;
  onChange: (quantity: number) => void;
  onDecrement: () => void;
  onRemove: () => void;
  className?: string;
}

export function QuantitySelector({
  productName,
  quantity,
  onChange,
  onDecrement,
  onRemove,
  className = "",
}: QuantitySelectorProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`flex h-12 min-w-0 items-center gap-2 rounded-full bg-[#f2e1e2] p-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#cfb7b1] bg-white text-[#443530] transition hover:border-[#b78e8c] hover:text-[#956a6b]"
        aria-label={`${t.productCard.remove} ${productName}`}
        title={t.productCard.remove}
      >
        <Trash2 size={17} aria-hidden="true" />
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
        inputMode="numeric"
        className="h-9 w-12 appearance-none rounded-md border border-stone-200 bg-white px-1 text-center font-semibold outline-none focus:border-rose-700 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label={`${t.productCard.quantity}: ${productName}`}
      />
      <span className="shrink-0 text-sm font-semibold text-stone-800">
        {t.productCard.pieces}
      </span>
      <QuantityStepper
        productName={productName}
        decreaseLabel={t.productCard.decrease}
        increaseLabel={t.productCard.increase}
        onDecrement={onDecrement}
        onIncrement={() => onChange(quantity + 1)}
        disableIncrement={quantity >= MAX_CART_ITEM_QUANTITY}
        className="ml-auto"
      />
    </div>
  );
}
