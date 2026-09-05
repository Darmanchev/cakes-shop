"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useCart } from "@/features/cart/CartProvider";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const { t } = useLanguage();
  const { totalItems } = useCart();

  return (
    <header className="relative z-30 shrink-0 border-b border-[#dfcec7]/80 bg-[#fbf6f0]/90 backdrop-blur-xl">
      <div className="flex h-[60px] items-center justify-between gap-3 px-4 sm:h-[68px] sm:px-7 lg:px-9">
        <Link
          href="/"
          className="font-display min-w-0 truncate text-xl font-semibold tracking-[-0.045em] text-[#443530] sm:text-2xl"
        >
          {SITE_NAME}
          <span className="ml-1 text-[#b78e8c]">.</span>
        </Link>

        <div className="flex min-w-0 items-center justify-self-end gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <Link
            href="/order"
            className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#443530] px-3 text-sm font-semibold text-white transition hover:bg-[#6b4f47] sm:px-4"
            aria-label={`${t.cart.label}: ${totalItems}`}
          >
            <ShoppingBag size={17} aria-hidden="true" />
            <span className="hidden lg:inline">{t.hero.orderCta}</span>
            {totalItems > 0 ? (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[#d9aaa9] px-1 text-[11px] font-bold leading-5 text-[#443530]">
                {totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
