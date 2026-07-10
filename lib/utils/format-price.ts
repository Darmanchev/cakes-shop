import { localeByLanguage, type Language } from '@/lib/i18n';

export function formatPrice(price: number, language: Language) {
  return new Intl.NumberFormat(localeByLanguage[language], {
    style: 'currency',
    currency: 'BGN',
    maximumFractionDigits: 0,
  }).format(price);
}
