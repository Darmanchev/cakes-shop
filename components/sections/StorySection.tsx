"use client";

import Image from "next/image";
import { useLanguage } from "@/components/language/LanguageProvider";

export function StorySection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="relative w-full bg-[#f7e9de] py-24 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-20 lg:gap-24 relative z-10">
        <div className="relative aspect-square w-full max-w-[500px] mx-auto drop-shadow-xl">
          <Image
            src="/images/sections/baker-decorating-cake.png"
            alt={t.story.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover rounded-[3rem]"
          />
        </div>
        
        <div className="space-y-8 max-w-md">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-[#4a3a35] leading-tight whitespace-pre-line">
            {t.story.title}
          </h2>
          
          {/* Wavy line decoration */}
          <svg width="100" height="20" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10 Q 12.5 0, 25 10 T 50 10 T 75 10 T 100 10" stroke="#b78e8c" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
          
          <p className="text-lg text-[#4a3a35]/80 font-medium leading-relaxed">
            {t.story.desc}
          </p>
        </div>
      </div>
    </section>
  );
}
