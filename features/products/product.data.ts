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
    image: "/products/cake_napoleon_with_fruits-cafe-bokeh.png",
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
    image: "/products/cake_white_hyinea-cafe-bokeh.png",
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
    image: "/products/cake_medovic-cafe-bokeh.png",
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
    image: "/products/cake_nuts-cafe-bokeh.png",
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
    image: "/products/rulet-cafe-bokeh.png",
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
    image: "/products/sinabon1.jpg",
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
    image: "/products/sinabon_with_cover.jpg",
    weight: "280 г",
    filling: "Мак, канела, сметанова глазура",
    prepTime: "В наличност или 1 ден",
  },
  {
    id: "cin-3",
    name: "Плодов синнабон",
    category: "cinnabons",
    priceMinor: 194,
    description: "Пухкава ролка с домашно малиново сладко и крем чийз.",
    image:
      "https://images.unsplash.com/photo-1616801646274-124b11f0cbab?w=800&q=80",
    weight: "260 г",
    filling: "Малина, крема сирене",
    prepTime: "В наличност или 1 ден",
  },
  {
    id: "combo-1",
    name: 'Сет "Уютна вечер"',
    category: "combos",
    priceMinor: 920,
    description:
      "Кутия с 6 пресни синнабона: 3 класически и 3 шоколадови. Добър избор за компания.",
    image:
      "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=800&q=80",
    weight: "1.5 кг",
    prepTime: "1 ден",
  },
  {
    id: "combo-2",
    name: "Празничен сет",
    category: "combos",
    priceMinor: 1636,
    description:
      "Асорти от 9 мини синнабона с различни вкусове. Подходящо за голяма маса.",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
    weight: "1.8 кг",
    prepTime: "1 ден",
  },
  {
    id: "combo-3",
    name: "Сет за двама",
    category: "combos",
    priceMinor: 460,
    description:
      "2 синнабона по избор и 2 порции филтър кафе или авторски чай.",
    image:
      "https://images.unsplash.com/photo-1495474472205-51e7d9b932dc?w=800&q=80",
    weight: "800 г",
    prepTime: "В наличност",
  },
];
