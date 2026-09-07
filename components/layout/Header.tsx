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
    <header className="relative z-50 flex w-full h-24 items-center justify-between px-8 bg-[#f7e9de] text-[#4a3a35]">
      <Link
        href="/"
        className="font-display text-3xl font-semibold tracking-wide"
      >
        {SITE_NAME}
      </Link>

      <nav className="hidden md:flex items-center gap-10 font-semibold tracking-wide text-sm">
        <Link href="/" className="hover:opacity-70 transition-opacity">{t.footerNew.home}</Link>
        <Link href="/products" className="hover:opacity-70 transition-opacity">{t.footerNew.cakes}</Link>
        <Link href="/#collections" className="hover:opacity-70 transition-opacity">{t.footerNew.collections}</Link>
        <Link href="/#about" className="hover:opacity-70 transition-opacity">{t.footerNew.about}</Link>
      </nav>

      <div className="flex items-center gap-6">
        <button aria-label="Search" className="hover:opacity-70 transition-opacity">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        
        <Link href="/cart" className="relative hover:opacity-70 transition-opacity" aria-label="Cart">
          <ShoppingBag size={22} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#9c7371] text-[10px] font-bold text-white">
              {totalItems}
            </span>
          )}
        </Link>
        
        <LanguageSwitcher />

        <Link
          href="/order"
          className="hidden lg:inline-flex h-10 items-center justify-center rounded-full bg-[#9c7371] px-6 text-sm font-semibold text-white transition hover:bg-[#7a5957]"
        >
          {t.hero.orderNow}
        </Link>
      </div>
    </header>
  );
}
