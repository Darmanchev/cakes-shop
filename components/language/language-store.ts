import { defaultLanguage, LANGUAGES, type Language } from "@/lib/i18n";

const languageStorageKey = "stas-cakes-language";
const languageChangeEvent = "stas-cakes-language-change";
let memoryLanguage = defaultLanguage;

function isLanguage(value: string | null): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  try {
    const storedLanguage = window.localStorage.getItem(languageStorageKey);
    return isLanguage(storedLanguage) ? storedLanguage : memoryLanguage;
  } catch {
    return memoryLanguage;
  }
}

export function subscribeToLanguageChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(languageChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(languageChangeEvent, callback);
  };
}

export function setStoredLanguage(nextLanguage: Language) {
  memoryLanguage = nextLanguage;
  try {
    window.localStorage.setItem(languageStorageKey, nextLanguage);
  } catch {
    // Language selection remains available for this tab without storage.
  }
  window.dispatchEvent(new Event(languageChangeEvent));
}
