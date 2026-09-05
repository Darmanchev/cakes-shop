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
    <header className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-8 text-[#f7e9de]">
      <Link
        href="/"
        className="font-display text-3xl font-semibold tracking-wide"
      >
        {SITE_NAME}
      </Link>

      <nav className="hidden md:flex items-center gap-10 font-semibold tracking-wide">
        <Link href="/" className="border-b-2 border-white pb-1">{t.footerNew.home}</Link>
        <Link href="#cakes" className="hover:opacity-80 transition-opacity">{t.footerNew.cakes}</Link>
        <Link href="#collections" className="hover:opacity-80 transition-opacity">{t.footerNew.collections}</Link>
        <Link href="#about" className="hover:opacity-80 transition-opacity">{t.footerNew.about}</Link>
      </nav>

      <div className="flex items-center gap-6">
        <button aria-label="Search" className="hover:opacity-80 transition-opacity">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        
        <Link href="/cart" className="relative hover:opacity-80 transition-opacity" aria-label="Cart">
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#d9aaa9] text-[10px] font-bold text-[#443530]">
              {totalItems}
            </span>
          )}
        </Link>
        
        <LanguageSwitcher />

        <Link
          href="/order"
          className="hidden lg:inline-flex h-10 items-center justify-center rounded-full bg-white/20 px-6 font-semibold text-white backdrop-blur-sm transition hover:bg-white/30 border border-white/30"
        >
          {t.hero.orderNow}
        </Link>
      </div>
    </header>
  );
}
