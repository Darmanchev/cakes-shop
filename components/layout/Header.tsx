'use client';

import { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { useLanguage } from '@/components/language/LanguageProvider';
import { useCart } from '@/features/cart/CartProvider';
import { SITE_NAME } from '@/lib/constants';

export function Header() {
  const { t } = useLanguage();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-6 sm:py-4">
        <a href="#" className="shrink-0 text-lg font-semibold sm:text-xl">
          {SITE_NAME}
        </a>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-6 text-sm text-stone-700 sm:flex">
            {t.navigation.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-rose-700">
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#order"
            className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-800 transition hover:border-rose-700 hover:text-rose-700"
            aria-label={`${t.cart.label}: ${totalItems}`}
            title={t.cart.label}
          >
            <ShoppingBag size={19} aria-hidden="true" />
            {totalItems > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-700 px-1 text-[11px] font-semibold leading-5 text-white">
                {totalItems}
              </span>
            ) : null}
          </a>
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={isMenuOpen ? 'Затвори навигацията' : 'Отвори навигацията'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white text-stone-800 sm:hidden"
          >
            {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav id="mobile-navigation" className="border-t border-stone-200 bg-white px-3 py-2 sm:hidden">
          {t.navigation.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-stone-800 hover:bg-stone-100 hover:text-rose-700"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
