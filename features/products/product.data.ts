import type { Product } from "./product.types";

// За MVP продуктите могат да стоят директно в кода.
// По-късно този масив лесно може да се замени с данни от Supabase, CMS или админка.
export const products: Product[] = [
  {
    id: "cake-1",
    name: "Наполеон с горски плодове",
    category: "cakes",
    priceMinor: 2301,
    description:
      "Фини хрупкави блатове, лек ванилов крем и свежи горски плодове за балансиран вкус.",
    image: "/images/products/cakes/napoleon-cutout.png",
    weight: "1.5 кг (6-8 порции)",
    filling: "Ванилов крем, горски плодове",
    prepTime: "2-3 дни",
  },
  {
    id: "cake-2",
    name: "Млечна девойка",
    category: "cakes",
    priceMinor: 2659,
    description:
      "Нежна торта от тънки млечни блатове и лек крем с фин ванилов вкус.",
    image: "/images/products/cakes/milk-girl-cutout.png",
    weight: "2 кг (10-12 порции)",
    filling: "Млечни блатове, ванилов крем",
    prepTime: "2-3 дни",
  },
  {
    id: "cake-3",
    name: "Класически медовик",
    category: "cakes",
    priceMinor: 2045,
    description:
      "Традиционна медена торта със сметанов крем. Топи се в устата.",
    image: "/images/products/cakes/medovik-cutout.png",
    weight: "1.8 кг (8-10 порции)",
    filling: "Медени блатове, сметанов крем",
    prepTime: "2 дни",
  },
  {
    id: "cake-4",
    name: "Вафлена торта",
    category: "cakes",
    priceMinor: 2045,
    description:
      "Хрупкави вафлени блатове, карамелен крем и орехи за богат домашен вкус.",
    image: "/images/products/cakes/waffle-cake-cutout.png",
    weight: "1.8 кг (8-10 порции)",
    filling: "Вафлени блатове, карамелен крем, орехи",
    prepTime: "2 дни",
  },
  {
    id: "cake-5",
    name: "Меренгов рулет",
    category: "cakes",
    priceMinor: 2301,
    description: "Лек меренгов рулет с нежен крем и свежи горски плодове.",
    image: "/images/products/cakes/meringue-roll-cutout.png",
    weight: "1.2 кг (8-10 порции)",
    filling: "Меренг, ванилов крем, горски плодове",
    prepTime: "2 дни",
  },
  {
    id: "cin-1",
    name: "Синнабон с канела",
    category: "cinnabons",
    priceMinor: 179,
    description: "Топла пухкава канелена ролка с фирмена сметанова глазура.",
    image: "/images/products/cinnabons/classic-cinnabon-cutout.png",
    weight: "250 г",
    filling: "Канела, кафява захар",
    prepTime: "В наличност или 1 ден",
  },
  {
    id: "cin-2",
    name: "Синнабон с мак",
    category: "cinnabons",
    priceMinor: 215,
    description: "Пухкава канелена ролка с мак и нежна сметанова глазура.",
    image: "/images/products/cinnabons/poppy-seed-cinnabon-cutout.png",
    weight: "280 г",
    filling: "Мак, канела, сметанова глазура",
    prepTime: "В наличност или 1 ден",
  },
  {
    id: "muffin-1",
    name: "Мъфин Baba Neagra",
    category: "muffins",
    priceMinor: 200,
    description:
      "Сочен тъмен мъфин Baba Neagra с нежен ванилов крем и вишнев топинг.",
    image: "/images/products/muffins/baba-neagra-cutout.png",
    weight: "1 бр.",
    filling: "Baba Neagra, ванилов крем, вишни",
    prepTime: "1 ден",
  },
  {
    id: "muffin-2",
    name: "Мъфин с боровинки",
    category: "muffins",
    priceMinor: 200,
    description:
      "Пухкав ванилов мъфин с цели боровинки и хрупкави филирани бадеми.",
    image: "/images/products/muffins/blueberry-muffins-cutout.png",
    weight: "1 бр.",
    filling: "Боровинки, ванилия, филирани бадеми",
    prepTime: "1 ден",
  },
];

export function filterProductsByCategory(
  catalog: Product[],
  category: Product["category"],
) {
  return catalog.filter((product) => product.category === category);
}
