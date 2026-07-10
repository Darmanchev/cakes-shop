'use client';

import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { useLanguage } from '@/components/language/LanguageProvider';
import { SITE_NAME } from '@/lib/constants';

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="border-b border-stone-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <a href="#" className="text-xl font-semibold">
          {SITE_NAME}
        </a>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-sm text-stone-700 sm:flex">
            {t.navigation.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-rose-700">
                {link.label}
              </a>
            ))}
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
