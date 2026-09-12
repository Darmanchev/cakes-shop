"use client";

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { useLanguage } from "@/components/language/LanguageProvider";

export function StorefrontFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative w-full bg-[#9c7371] text-[#f7e9de] pt-20 pb-8 px-8">
      {/* Top Torn Edge (Burgundy brush stroke bleeding UP into the beige section) */}
      <div 
        className="absolute -top-10 md:-top-16 left-0 right-0 h-16 md:h-24 z-10 pointer-events-none"
        style={{
          backgroundImage: 'url(/images/hero/edge.svg)',
          backgroundSize: '100% 100%',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="painted-hero__texture absolute inset-0 opacity-20" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <Link href="/" className="font-display text-3xl font-semibold tracking-wide">
            {SITE_NAME}
          </Link>
          <p className="text-sm text-[#f7e9de]/80 max-w-xs font-light">
            {t.footerNew.desc}
          </p>

        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">{t.footerNew.quickLinks}</h4>
          <ul className="space-y-3 text-sm text-[#f7e9de]/80">
            <li><Link href="/" className="hover:text-white transition-colors">{t.footerNew.home}</Link></li>
            <li><Link href="/products" className="hover:text-white transition-colors">{t.footerNew.cakes}</Link></li>
            <li><Link href="/#collections" className="hover:text-white transition-colors">{t.footerNew.collections}</Link></li>
            <li><Link href="/#about" className="hover:text-white transition-colors">{t.footerNew.about}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">{t.footerNew.customerCare}</h4>
          <p className="text-sm leading-6 text-[#f7e9de]/80">{t.order.deliveryNote}</p>
          <Link href="/order" className="mt-4 inline-flex text-sm font-semibold hover:text-white transition-colors">
            {t.hero.orderCta}
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mt-16 pt-8 border-t border-white/20 text-center text-sm text-[#f7e9de]/70">
        <p>&copy; {new Date().getFullYear()} {SITE_NAME} Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
}
