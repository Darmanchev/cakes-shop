'use client';

import Image from 'next/image';
import { CakeSlice } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';

export function ProductHero() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-10 lg:py-16">
      <div>
        <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-900">
          <CakeSlice size={17} aria-hidden="true" />
          {t.hero.badge}
        </p>
        <h1 className="max-w-3xl text-3xl font-bold leading-tight min-[420px]:text-4xl sm:text-5xl lg:text-6xl">
          {t.hero.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-700 sm:mt-5 sm:text-lg sm:leading-8">
          {t.hero.description}
        </p>
        <div className="mt-6 grid gap-3 min-[400px]:grid-cols-2 sm:mt-8 sm:flex sm:flex-wrap">
          <a href="#catalog" className="inline-flex h-12 items-center justify-center rounded-md bg-rose-700 px-5 text-center text-sm font-medium text-white hover:bg-rose-800">
            {t.hero.catalogCta}
          </a>
          <a href="#order" className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-center text-sm font-medium text-stone-950 hover:border-stone-950">
            {t.hero.orderCta}
          </a>
        </div>
      </div>

      <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg bg-stone-100 shadow-sm sm:block">
        <Image
          src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=85"
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
