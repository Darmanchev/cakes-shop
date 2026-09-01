"use client";

import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language/LanguageSwitcher";
import { useLanguage } from "@/components/language/LanguageProvider";
import { useCart } from "@/features/cart/CartProvider";
import { SITE_NAME } from "@/lib/constants";

export function Header() {
  const { language, t } = useLanguage();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navLinks = [
    t.navigation[0],
    t.navigation[1],
    {
      href: "#about",
      label:
        language === "bg" ? "За мен" : language === "ru" ? "Обо мне" : "About",
    },
    {
      href: "#order",
      label:
        language === "bg"
          ? "Контакти"
          : language === "ru"
            ? "Контакты"
            : "Contact",
    },
  ];

  return (
    <header className="relative z-20 border-b border-[#ddcec1] bg-[#faf6f0]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-2 px-4 py-4 sm:px-8 md:grid md:grid-cols-[1fr_auto_1fr] lg:px-10 lg:py-5">
        <a
          href="#"
          className="font-display shrink-0 text-xl font-semibold tracking-[-0.04em] sm:text-2xl"
        >
          {SITE_NAME}
        </a>
        <nav className="hidden items-center gap-9 text-[13px] text-stone-700 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-[#7c1028]"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex min-w-0 items-center justify-self-end gap-2 sm:gap-3">
          <a
            href="#order"
            className="relative inline-flex size-9 shrink-0 items-center justify-center text-stone-800 transition hover:text-[#7c1028]"
            aria-label={`${t.cart.label}: ${totalItems}`}
            title={t.cart.label}
          >
            <ShoppingBag size={19} aria-hidden="true" />
            {totalItems > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-[#7c1028] px-1 text-[11px] font-semibold leading-5 text-white">
                {totalItems}
              </span>
            ) : null}
          </a>
          <LanguageSwitcher />
          <button
            type="button"
            aria-label={
              isMenuOpen ? "Затвори навигацията" : "Отвори навигацията"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="inline-flex size-9 shrink-0 items-center justify-center text-stone-800 md:hidden"
          >
            {isMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <nav
          id="mobile-navigation"
          className="border-t border-[#ddcec1] bg-[#faf6f0] px-3 py-2 md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-stone-800 hover:bg-[#f0e5da] hover:text-[#7c1028]"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
