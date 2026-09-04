"use client";

import Image from "next/image";
import { Heart, Leaf, Wheat } from "lucide-react";
import { useLanguage } from "@/components/language/LanguageProvider";

const copy = {
  bg: {
    eyebrow: "Направено с любов",
    title: "Приготвяме всеки десерт с внимание към детайла",
    text: "Използваме качествени продукти, пресни плодове и доказани рецепти, за да създаваме вкус, който носи радост.",
    benefits: [
      "Качествени продукти",
      "Пресни съставки",
      "Приготвено по поръчка",
    ],
    imageAlt: "Сладкар украсява торта с пресни плодове",
  },
  en: {
    eyebrow: "Made with care",
    title: "Every dessert is made with attention to every detail",
    text: "We use quality ingredients, fresh fruit, and trusted recipes to create flavours that bring joy.",
    benefits: ["Quality ingredients", "Fresh ingredients", "Made to order"],
    imageAlt: "Baker decorating a cake with fresh berries",
  },
  ru: {
    eyebrow: "Сделано с любовью",
    title: "Готовим каждый десерт с вниманием к деталям",
    text: "Используем качественные продукты, свежие ягоды и проверенные рецепты, чтобы создавать вкус, который радует.",
    benefits: [
      "Качественные продукты",
      "Свежие ингредиенты",
      "Готовим на заказ",
    ],
    imageAlt: "Кондитер украшает торт свежими ягодами",
  },
};

export function CareSection() {
  const { language } = useLanguage();
  const content = copy[language];
  const icons = [
    <Leaf key="leaf" size={22} />,
    <Wheat key="wheat" size={22} />,
    <Heart key="heart" size={22} />,
  ];

  return (
    <section id="about" className="bg-[#f6eee6]">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
        <div className="relative min-h-[320px] overflow-hidden rounded-xl sm:min-h-[420px]">
          <Image
            src="/images/sections/baker-decorating-cake.png"
            alt={content.imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-5 py-12 sm:px-10 lg:px-8 lg:py-16 xl:px-14">
          <div className="max-w-lg">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8a695a]">
              {content.eyebrow}
            </p>
            <h2 className="font-display mt-3 text-4xl font-medium leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-[2.5rem] xl:text-5xl">
              {content.title}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-stone-700">
              {content.text}
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {content.benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="min-w-0 flex items-center gap-3 text-[13px] font-medium leading-5 text-stone-800 sm:block"
                >
                  <span className="mb-0 text-[#7c1028] sm:mb-2 sm:block">
                    {icons[index]}
                  </span>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
