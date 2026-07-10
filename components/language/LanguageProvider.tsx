'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  defaultLanguage,
  LANGUAGES,
  type Language,
  translations,
} from '@/lib/i18n';

const languageStorageKey = 'stas-cakes-language';
const languageChangeEvent = 'stas-cakes-language-change';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (typeof translations)[Language];
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

function getStoredLanguage(): Language {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  const storedLanguage = window.localStorage.getItem(languageStorageKey);

  return isLanguage(storedLanguage) ? storedLanguage : defaultLanguage;
}

function subscribeToLanguageChanges(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(languageChangeEvent, callback);

  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(languageChangeEvent, callback);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguageChanges,
    getStoredLanguage,
    () => defaultLanguage,
  );

  const setLanguage = useCallback((nextLanguage: Language) => {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
    window.dispatchEvent(new Event(languageChangeEvent));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language, setLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
