'use client';

import { Globe2 } from 'lucide-react';
import { languageOptions } from '@/lib/i18n';
import { useLanguage } from './LanguageProvider';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-stone-200 bg-white p-1" aria-label="Language switcher">
      <Globe2 size={16} className="ml-1 text-stone-500" aria-hidden="true" />
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-label={option.ariaLabel}
          aria-pressed={language === option.code}
          onClick={() => setLanguage(option.code)}
          className={`h-8 rounded px-2 text-xs font-semibold transition ${
            language === option.code
              ? 'bg-rose-700 text-white'
              : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
