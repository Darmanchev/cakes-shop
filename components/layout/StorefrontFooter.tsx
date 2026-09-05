"use client";

import Image from "next/image";
import { AtSign, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";
import { SITE_NAME } from "@/lib/constants";

const contactItems = [
  { key: "phone", Icon: Phone },
  { key: "instagram", Icon: AtSign },
  { key: "location", Icon: MapPin },
] as const;

export function StorefrontFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative h-[58px] shrink-0 overflow-hidden px-4 text-[#fffaf5] sm:px-6">
      <Image
        src="/images/hero/pink-brush-stroke.png"
        alt=""
        fill
        sizes="(max-width: 1440px) 100vw, 1440px"
        className="scale-x-[1.04] object-fill brightness-[0.72] saturate-[0.88]"
        aria-hidden="true"
      />
      <div className="painted-hero__texture absolute inset-0 opacity-35" aria-hidden="true" />

      <div className="relative z-10 grid h-full grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <p className="font-display text-sm font-semibold tracking-[-0.02em] sm:text-base">
          {SITE_NAME}<span className="text-[#f4c7c4]">.</span>
        </p>

        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {contactItems.map(({ key, Icon }) => (
            <span
              key={key}
              className="inline-flex items-center gap-1.5 text-[10px] font-semibold sm:text-xs"
              title={t.footer[key]}
            >
              <Icon size={14} aria-hidden="true" />
              <span className="hidden min-[540px]:inline">{t.footer[key]}</span>
            </span>
          ))}
        </div>

        <p className="hidden justify-self-end text-[10px] font-medium text-[#fffaf5]/85 sm:block">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
