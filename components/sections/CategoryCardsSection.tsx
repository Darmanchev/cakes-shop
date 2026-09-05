"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

export function CategoryCardsSection() {
  const { t } = useLanguage();

  const categories = [
    {
      id: "cakes",
      title: t.categoryCards.cakesTitle,
      subtitle: t.categoryCards.cakesSubtitle,
      image: "/images/products/cakes/medovik-cutout.png",
      bgColor: "bg-[#f4dcd9]", // Soft Pink
      href: "/#cakes",
    },
    {
      id: "cinnabons",
      title: t.categoryCards.cinnabonsTitle,
      subtitle: t.categoryCards.cinnabonsSubtitle,
      image: "/images/products/cinnabons/classic-cinnabon-cutout.png",
      bgColor: "bg-[#ebdccc]", // Warm Beige
      href: "/#cinnabons",
    },
    {
      id: "muffins",
      title: t.categoryCards.muffinsTitle,
      subtitle: t.categoryCards.muffinsSubtitle,
      image: "/images/products/muffins/blueberry-muffins-cutout.png",
      bgColor: "bg-[#d8ccd6]", // Lavender
      href: "/#muffins",
    },
  ];

  return (
    <section id="collections" className="w-full bg-[#f7e9de] py-16 px-8 flex justify-center">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={`group relative flex flex-col items-center p-10 rounded-[2rem] ${category.bgColor} transition-transform hover:-translate-y-2 hover:shadow-xl`}
          >
            <h3 className="font-display text-4xl text-center font-semibold text-[#4a3a35] whitespace-pre-line mb-8 z-10">
              {category.title}
            </h3>
            
            <div className="relative w-full aspect-square max-w-[240px] mb-8 drop-shadow-2xl">
              <Image
                src={category.image}
                alt={category.title.replace('\n', ' ')}
                fill
                className="object-contain"
              />
            </div>

            <div className="w-full flex items-end justify-between mt-auto">
              <p className="text-sm font-medium text-[#4a3a35]/80 whitespace-pre-line">
                {category.subtitle}
              </p>
              <div className="bg-white/80 p-3 rounded-full text-[#4a3a35] group-hover:bg-white transition-colors">
                <ArrowRight size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
