"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language/LanguageProvider";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full py-16 md:py-24 bg-[#9c7371] flex items-center mt-12 mb-12">
      {/* Top Torn Edge (Burgundy brush stroke bleeding UP into the beige header) */}
      <div 
        className="absolute -top-10 md:-top-16 left-0 right-0 h-16 md:h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/hero/edge.svg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Bottom Torn Edge (Burgundy brush stroke bleeding DOWN into the beige section) */}
      <div 
        className="absolute -bottom-10 md:-bottom-16 left-0 right-0 h-16 md:h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/hero/edge.svg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
          transform: 'scaleY(-1) scaleX(-1)', // Flip both ways for variation
        }}
        aria-hidden="true"
      />

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
              href="/products" 
              className="inline-block bg-[#4a3a35] text-[#f7e9de] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#382b27] transition-colors"
            >
              {t.hero.exploreCakes}
            </Link>
          </div>
        </div>

        <div className="relative h-[350px] md:h-[500px] w-full">
          <Image
            src="/images/hero/berry-cake-cutout.png"
            alt={t.hero.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
