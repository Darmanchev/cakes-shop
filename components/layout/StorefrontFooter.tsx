"use client";

import Link from "next/link";
import { AtSign, MapPin, Phone } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";
import { useLanguage } from "@/components/language/LanguageProvider";

export function StorefrontFooter() {
  const { t } = useLanguage();

  return (
    <footer className="relative w-full bg-[#9c7371] text-[#f7e9de] pt-16 pb-8 px-8">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="painted-hero__texture absolute inset-0 opacity-20" aria-hidden="true" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="font-display text-3xl font-semibold tracking-wide">
            {SITE_NAME}
          </Link>
          <p className="text-sm text-[#f7e9de]/80 max-w-xs font-light">
            {t.footerNew.desc}
          </p>
          <div className="flex gap-4 pt-4">
            <a href="#" className="hover:text-white transition-colors" aria-label="Instagram"><AtSign size={20} /></a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></a>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">{t.footerNew.quickLinks}</h4>
          <ul className="space-y-3 text-sm text-[#f7e9de]/80">
            <li><Link href="/" className="hover:text-white transition-colors">{t.footerNew.home}</Link></li>
            <li><Link href="#cakes" className="hover:text-white transition-colors">{t.footerNew.cakes}</Link></li>
            <li><Link href="#collections" className="hover:text-white transition-colors">{t.footerNew.collections}</Link></li>
            <li><Link href="#about" className="hover:text-white transition-colors">{t.footerNew.about}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">{t.footerNew.customerCare}</h4>
          <ul className="space-y-3 text-sm text-[#f7e9de]/80">
            <li><Link href="#" className="hover:text-white transition-colors">{t.footerNew.faqs}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t.footerNew.shipping}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t.footerNew.returns}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t.footerNew.terms}</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">{t.footerNew.privacy}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-lg">{t.footerNew.visitUs}</h4>
          <ul className="space-y-4 text-sm text-[#f7e9de]/80">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0" />
              <span>123 Dessert Lane,<br/>Sweet City, CA 90210</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="shrink-0" />
              <span>+1 (555) 123-4567</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto mt-16 pt-8 border-t border-white/20 text-center text-sm text-[#f7e9de]/70">
        <p>&copy; {new Date().getFullYear()} {SITE_NAME} Bakery. All rights reserved.</p>
      </div>
    </footer>
  );
}
