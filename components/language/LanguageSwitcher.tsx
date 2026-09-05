"use client";

import { languageOptions } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[#efe3dd] p-0.5"
      aria-label="Language switcher"
    >
      {languageOptions.map((option) => (
        <button
          key={option.code}
          type="button"
          aria-label={option.ariaLabel}
          aria-pressed={language === option.code}
          onClick={() => setLanguage(option.code)}
          className={`h-7 rounded-full px-2 text-[10px] font-bold transition sm:px-2.5 ${
            language === option.code
              ? "bg-[#b78e8c] text-white shadow-sm"
              : "text-[#765f58] hover:bg-white/70 hover:text-[#443530]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
