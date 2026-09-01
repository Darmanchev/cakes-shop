"use client";

import { CakeSlice, MessageCircle, Truck } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { InfoCard } from "@/components/ui/InfoCard";

export function OrderStepsSection() {
  const { t } = useLanguage();
  const icons = [
    <MessageCircle key="request" size={22} aria-hidden="true" />,
    <CakeSlice key="details" size={22} aria-hidden="true" />,
    <Truck key="delivery" size={22} aria-hidden="true" />,
  ];

  return (
    <section id="how" className="bg-[#f0e5da] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a695a]">
          {t.orderSteps.title}
        </p>
        <h2 className="font-display mt-2 text-4xl font-medium tracking-[-0.04em] sm:text-5xl">
          {t.hero.orderCta}
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {t.orderSteps.steps.map((step, index) => (
            <InfoCard
              key={step.title}
              icon={icons[index]}
              title={step.title}
              text={step.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
