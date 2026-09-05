"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/components/language/LanguageProvider";

export function CoffeeSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full bg-[#f7e9de] py-24 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-16 relative z-10">
        <div className="relative aspect-square w-full max-w-[500px] mx-auto drop-shadow-xl">
          <Image
            src="/images/sections/baker-decorating-cake.png"
            alt="Baker decorating a cake"
            fill
            className="object-cover rounded-[3rem]"
          />
        </div>
        
        <div className="space-y-6 max-w-md">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-[#4a3a35] leading-tight whitespace-pre-line">
            {t.story.title}
          </h2>
          
          {/* Wavy line decoration */}
          <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" stroke="#b78e8c" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          
          <p className="text-lg text-[#4a3a35]/80 font-medium">
            {t.story.desc}
          </p>
          
          <div className="pt-4">
            <Link 
              href="#about" 
              className="inline-block bg-[#9c7371] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#725456] transition-colors"
            >
              {t.story.cta}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Torn Edge / Brush Stroke at the bottom connecting to footer */}
      <div className="absolute -bottom-1 left-0 right-0 h-12 md:h-24 bg-[#9c7371] z-20" style={{
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
