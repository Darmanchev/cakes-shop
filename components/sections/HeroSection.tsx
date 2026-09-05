"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language/LanguageProvider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full min-h-[90vh] bg-[#9c7371] flex items-center pt-16 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="painted-hero__texture absolute inset-0 opacity-20" aria-hidden="true" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        <div className="text-[#f7e9de] space-y-8 max-w-lg">
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            {t.hero.heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-[#f7e9de]/90 leading-relaxed font-light">
            {t.hero.heroDesc}
          </p>
          <div className="pt-4">
            <Link 
              href="#cakes" 
              className="inline-block bg-[#4a3a35] text-[#f7e9de] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#382b27] transition-colors"
            >
              {t.hero.exploreCakes}
            </Link>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[600px] w-full">
          <Image
            src="/images/hero/berry-cake-cutout.png"
            alt="Delicious berry cake"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
      
      {/* Torn Edge / Brush Stroke at the bottom */}
      <div className="absolute -bottom-1 left-0 right-0 h-12 md:h-16 bg-[#f7e9de]" style={{
        maskImage: 'url(/images/hero/pink-brush-stroke.png)',
        maskSize: '100% 100%',
        maskPosition: 'top',
        maskRepeat: 'no-repeat',
        WebkitMaskImage: 'url(/images/hero/pink-brush-stroke.png)',
        WebkitMaskSize: '100% 100%',
        WebkitMaskPosition: 'top',
        WebkitMaskRepeat: 'no-repeat',
      }}>
      </div>
    </section>
  );
}
