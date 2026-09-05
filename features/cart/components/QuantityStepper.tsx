"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  productName: string;
  decreaseLabel: string;
  increaseLabel: string;
  onDecrement: () => void;
  onIncrement: () => void;
  disableIncrement?: boolean;
  className?: string;
}

export function QuantityStepper({
  productName,
  decreaseLabel,
  increaseLabel,
  onDecrement,
  onIncrement,
  disableIncrement = false,
  className = "",
}: QuantityStepperProps) {
  return (
    <div
      data-quantity-stepper="true"
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-[#bfa6a0] bg-[#fffaf5] ${className}`}
    >
      <button
        type="button"
        onClick={onDecrement}
        className="inline-flex size-8 items-center justify-center border-r border-[#d7c1ba] text-[#443530] transition hover:bg-[#ead0d4] sm:size-9"
        aria-label={`${decreaseLabel} ${productName}`}
        title={decreaseLabel}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onIncrement}
        disabled={disableIncrement}
        className="inline-flex size-8 items-center justify-center bg-[#443530] text-white transition hover:bg-[#60483f] disabled:cursor-not-allowed disabled:opacity-50 sm:size-9"
        aria-label={`${increaseLabel} ${productName}`}
        title={increaseLabel}
      >
        <Plus size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
