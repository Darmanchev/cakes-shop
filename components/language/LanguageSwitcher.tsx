"use client";

import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex shrink-0 items-center gap-0.5"
      aria-label="Language switcher"
    >
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-label={option.ariaLabel}
          aria-pressed={language === option.code}
          onClick={() => setLanguage(option.code)}
          className={`h-7 rounded-sm px-2 text-[11px] font-semibold transition sm:px-2.5 ${
            language === option.code
              ? "bg-[#7c1028] text-white"
              : "text-stone-700 hover:bg-[#f0e5da] hover:text-stone-950"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
