"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { Product } from "@/features/products/product.types";
import { OrderForm } from "./OrderForm";

export function OrderContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <section id="order" className="bg-[#fcf9f5] px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-xl border border-[#e2cfc3] bg-[#f2dfd9] px-5 py-8 sm:px-9 sm:py-10 lg:grid-cols-[0.8fr_1fr] lg:gap-12 lg:px-14">
        <div className="lg:py-4">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
            {t.order.title}
          </h2>
          <p className="mt-3 leading-7 text-stone-700">{t.order.description}</p>
          <p className="mt-6 flex items-center gap-2 text-sm text-stone-700">
            <MapPin size={17} aria-hidden="true" />
            {t.order.deliveryNote}
          </p>
        </div>

        <OrderForm products={products} />
      </div>
    </section>
  );
}
