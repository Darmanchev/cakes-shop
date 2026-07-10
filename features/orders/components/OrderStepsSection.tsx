'use client';

import { CakeSlice, MessageCircle, Truck } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import { InfoCard } from '@/components/ui/InfoCard';

export function OrderStepsSection() {
  const { t } = useLanguage();
  const icons = [
    <MessageCircle key="request" size={22} aria-hidden="true" />,
    <CakeSlice key="details" size={22} aria-hidden="true" />,
    <Truck key="delivery" size={22} aria-hidden="true" />,
  ];

  return (
    <section id="how" className="bg-[#eef6ee] py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">{t.orderSteps.title}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.orderSteps.steps.map((step, index) => (
            <InfoCard key={step.title} icon={icons[index]} title={step.title} text={step.text} />
          ))}
        </div>
      </div>
    </section>
  );
}
