"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export function BackToCatalogLink() {
  const { t } = useLanguage();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-full border border-[#cfb7b1] bg-white/55 px-4 py-2 text-sm font-semibold transition hover:bg-white"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      {t.catalog.title}
    </Link>
  );
}
