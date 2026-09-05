"use client";

import { Dessert, Leaf } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-[#f7e9de] py-16 px-8 flex justify-center items-center gap-12 md:gap-32 flex-wrap">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4dcd9] text-[#9c7371]">
          <Dessert size={32} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold mb-1">{t.features.freshTitle}</h3>
          <p className="text-[#4a3a35]/70 text-sm font-medium">{t.features.freshDesc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ebdccc] text-[#9c7371]">
          <Leaf size={32} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold mb-1">{t.features.premiumTitle}</h3>
          <p className="text-[#4a3a35]/70 text-sm font-medium">{t.features.premiumDesc}</p>
        </div>
      </div>
    </section>
  );
}
