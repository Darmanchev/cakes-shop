"use client";

import Image from "next/image";
import { useLanguage } from "@/components/language/LanguageProvider";

export function ProductHero() {
  const { t } = useLanguage();

  return (
    <section className="paper-texture relative overflow-hidden">
      <svg
        viewBox="0 0 170 640"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute -left-7 top-14 z-[1] hidden h-[610px] w-[165px] text-[#b98e80]/45 lg:block"
      >
        <path
          d="M76 8C61 93 94 129 72 203C49 280 76 350 59 422C47 472 66 539 48 631"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M68 112C41 85 20 71 5 67C10 94 30 119 68 130C68 123 68 117 68 112Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M73 197C101 166 127 154 153 151C143 180 117 204 74 215C73 209 73 203 73 197Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M66 282C41 257 19 247 2 246C11 273 33 293 65 302C65 295 66 288 66 282Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M62 375C89 348 119 336 148 335C136 361 108 383 62 393C63 387 63 381 62 375Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M57 467C32 443 12 434 0 433C8 458 27 477 57 487C57 480 58 474 57 467Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M52 549C79 526 107 518 135 520C122 542 96 560 51 568C52 562 52 555 52 549Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M24 36H26M17 45H19M37 61H39M145 98H147M151 106H153M12 328H14M21 338H23M143 446H145M151 454H153"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
        <Image
          src="/images/hero/main-cake.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#faf5ef_0%,#faf5ef_28%,rgba(250,245,239,0.92)_42%,rgba(250,245,239,0.58)_58%,rgba(250,245,239,0)_74%)]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[590px] max-w-[1800px] items-center px-5 py-14 sm:px-10 lg:min-h-[650px] lg:pl-[clamp(8.75rem,9vw,11rem)] lg:pr-10 xl:pr-14">
        <div className="max-w-[540px] lg:mt-12">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a695a]">
            {t.hero.badge}
          </p>
          <h1 className="font-display max-w-xl text-[2.35rem] font-medium leading-[1.08] tracking-[-0.04em] min-[420px]:text-5xl sm:text-6xl lg:max-w-[590px] lg:text-[4rem] xl:text-[5rem]">
            {t.hero.title}
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-stone-700 sm:text-base">
            {t.hero.description}
          </p>
          <div className="mt-8 grid gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap">
            <a
              href="#catalog"
              className="inline-flex h-12 items-center justify-center rounded-sm bg-[#7c1028] px-6 text-center text-sm font-medium text-white transition hover:bg-[#5d0a1d]"
            >
              {t.hero.catalogCta}
            </a>
            <a
              href="#order"
              className="inline-flex h-12 items-center justify-center rounded-sm border border-[#9c7165] bg-transparent px-6 text-center text-sm font-medium text-stone-950 transition hover:bg-white/50"
            >
              {t.hero.orderCta}
            </a>
          </div>
        </div>
      </div>
      <div className="relative aspect-[16/10] w-full lg:hidden">
        <Image
          src="/images/hero/main-cake.png"
          alt={t.hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />
      </div>
    </section>
  );
}
