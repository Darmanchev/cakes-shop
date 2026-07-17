import {type Language, localeByLanguage} from '@/lib/i18n';

export function formatPrice(priceMinor: number, language: Language) {
    const priceEur = priceMinor / 100;

    return new Intl.NumberFormat(localeByLanguage[language], {
        style: 'currency',
        currency: 'EUR',
    }).format(priceEur);
}
