"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import type { Product } from "@/features/products/product.types";
import { OrderForm } from "./OrderForm";

export function OrderContent({ products }: { products: Product[] }) {
  const { t } = useLanguage();

  return (
    <section id="order" className="px-4 pb-10 pt-5 sm:px-8 sm:pb-12 lg:px-10">
      <div className="mx-auto grid max-w-[1080px] gap-7 rounded-[28px] border border-[#dfcec7] bg-[#e7d1d3] px-5 py-7 shadow-[0_18px_50px_rgba(68,53,48,0.08)] sm:px-8 sm:py-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-10 lg:px-10">
        <div className="lg:py-4">
          <h2 className="font-display text-4xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">
            {t.order.title}
          </h2>
          <p className="mt-3 leading-7 text-[#6f5b54]">{t.order.description}</p>
          <p className="mt-6 flex items-center gap-2 rounded-full bg-white/45 px-4 py-3 text-sm text-[#6f5b54]">
            <MapPin size={17} aria-hidden="true" />
            {t.order.deliveryNote}
          </p>
        </div>

        <OrderForm products={products} />
      </div>
    </section>
  );
}
