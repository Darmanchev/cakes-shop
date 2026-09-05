import type { Category } from "@/features/products/product.types";

export const LANGUAGES = ["bg", "en", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];

export const defaultLanguage: Language = "bg";

export const languageOptions: Array<{
  code: Language;
  label: string;
  ariaLabel: string;
}> = [
  { code: "bg", label: "BG", ariaLabel: "Български" },
  { code: "en", label: "EN", ariaLabel: "English" },
  { code: "ru", label: "RU", ariaLabel: "Русский" },
];

export const localeByLanguage: Record<Language, string> = {
  bg: "bg-BG",
  en: "en-US",
  ru: "ru-RU",
};

interface ProductCopy {
  name: string;
  description: string;
  weight?: string;
  filling?: string;
  prepTime: string;
}

interface AppTranslations {
  siteDescription: string;
  metadataTitle: string;
  navigation: Array<{ href: string; label: string }>;
  hero: {
    badge: string;
    title: string;
    heroTitle: string;
    heroDesc: string;
    exploreCakes: string;
    orderNow: string;
    description: string;
    catalogCta: string;
    orderCta: string;
    imageAlt: string;
    highlights: [string, string];
  };
  catalog: {
    title: string;
    sections: Record<Category, string>;
  };
  productCard: {
    categories: Record<Category, string>;
    from: string;
    order: string;
    add: string;
    pieces: string;
    quantity: string;
    decrease: string;
    increase: string;
    remove: string;
    limitReached: string;
  };
  cart: {
    label: string;
  };
  footer: {
    phone: string;
    instagram: string;
    location: string;
    copyright: string;
  };
  orderSteps: {
    title: string;
    steps: Array<{ title: string; text: string }>;
  };
  order: {
    title: string;
    description: string;
    deliveryNote: string;
  };
  form: {
    name: string;
    phone: string;
    email: string;
    product: string;
    productPlaceholder: string;
    quantity: string;
    productComment: string;
    orderItems: string;
    addProduct: string;
    removeProduct: string;
    date: string;
    openCalendar: string;
    deliveryType: string;
    delivery: string;
    pickup: string;
    deliveryAddress: string;
    comment: string;
    sending: string;
    submit: string;
    success: string;
    error: string;
    emptyCart: string;
    chooseProducts: string;
  };
  products: Record<string, ProductCopy>;

  features: {
    freshTitle: string;
    freshDesc: string;
    premiumTitle: string;
    premiumDesc: string;
  };
  categoryCards: {
    cakesTitle: string;
    cakesSubtitle: string;
    cinnabonsTitle: string;
    cinnabonsSubtitle: string;
    muffinsTitle: string;
    muffinsSubtitle: string;
  };
  story: {
    title: string;
    desc: string;
    cta: string;
  };
  footerNew: {
    desc: string;
    quickLinks: string;
    customerCare: string;
    visitUs: string;
    home: string;
    cakes: string;
    collections: string;
    about: string;
    contact: string;
    faqs: string;
    shipping: string;
    returns: string;
    terms: string;
    privacy: string;
  };
}

export const translations: Record<Language, AppTranslations> = {
  bg: {
    siteDescription: "Торти, синнабони и мъфини по поръчка.",
    metadataTitle: "Торти, синнабони и мъфини",
    navigation: [
      { href: "#catalog", label: "Каталог" },
      { href: "#how", label: "Как се поръчва" },
      { href: "#order", label: "Запитване" },
    ],
    hero: {
      badge: "Торти, синнабони и мъфини по поръчка",
      title: "Животът е по-сладък с нещо домашно",
      heroTitle: "Животът е по-сладък с нещо домашно.",
      heroDesc: "Вкусни ръчно изработени торти и десерти, приготвени с най-добрите съставки и много любов.",
      exploreCakes: "Разгледай тортите",
      orderNow: "Поръчай",
      description:
        "Изберете торта, синнабон или мъфин, оставете запитване, а ние ще уточним детайлите и ще потвърдим поръчката.",
      catalogCta: "Виж каталога",
      orderCta: "Остави запитване",
      imageAlt: "Шоколадова торта с крем",
      highlights: ["Прясно приготвено", "Качествени съставки"],
    },
    catalog: {
      title: "Каталог",
      sections: {
        cakes: "Торти",
        cinnabons: "Синнабони",
        muffins: "Мъфини",
      },
    },
    productCard: {
      categories: {
        cakes: "Торта",
        cinnabons: "Синнабон",
        muffins: "Мъфин",
      },
      from: "от",
      order: "Поръчай",
      add: "Добави",
      pieces: "бр.",
      quantity: "Количество",
      decrease: "Намали количеството за",
      increase: "Увеличи количеството за",
      remove: "Премахни",
      limitReached: "Можете да добавите най-много 10 различни продукта",
    },
    cart: {
      label: "Кошница",
    },
    footer: {
      phone: "Телефон",
      instagram: "Instagram",
      location: "Местоположение",
      copyright: "© 2026 Stas Cakes",
    },
    orderSteps: {
      title: "",
      steps: [
        {
          title: "1. Запитване",
          text: "Избирате продукт и оставяте контакти.",
        },
        {
          title: "2. Уточняване",
          text: "Уговаряме вкус, грамаж, дата и капаро.",
        },
        {
          title: "3. Получаване",
          text: "Вземане на място или доставка в уговорен час.",
        },
      ],
    },
    order: {
      title: "Как работи поръчката",
      description:
        "Напишете какво искате да поръчате и за коя дата. Ще се свържем с вас, ще уточним детайлите и ще потвърдим цената.",
      deliveryNote: "Доставка и вземане на място се уточняват след запитването",
    },
    form: {
      name: "Име",
      phone: "Телефон",
      email: "Имейл",
      product: "Какво искате да поръчате",
      productPlaceholder: "Изберете продукт",
      quantity: "Количество",
      productComment: "Коментар към продукта",
      orderItems: "Продукти в поръчката",
      addProduct: "Добави продукт",
      removeProduct: "Премахни продукта",
      date: "Дата, за която е нужна поръчката",
      openCalendar: "Отвори календар",
      deliveryType: "Начин на получаване",
      delivery: "Доставка",
      pickup: "Вземане на място",
      deliveryAddress: "Адрес за доставка",
      comment: "Коментар",
      sending: "Изпращане...",
      submit: "Изпрати запитване",
      success: "Запитването е изпратено.",
      error:
        "Запитването не беше изпратено. Проверете сървъра и опитайте отново.",
      emptyCart: "Все още няма избрани продукти.",
      chooseProducts: "Изберете продукти от каталога",
    },
    products: {
      "cake-1": {
        name: "Наполеон с горски плодове",
        description:
          "Фини хрупкави блатове, лек ванилов крем и свежи горски плодове за балансиран вкус.",
        weight: "1.5 кг (6-8 порции)",
        filling: "Ванилов крем, горски плодове",
        prepTime: "2-3 дни",
      },
      "cake-2": {
        name: "Млечна девойка",
        description:
          "Нежна торта от тънки млечни блатове и лек крем с фин ванилов вкус.",
        weight: "2 кг (10-12 порции)",
        filling: "Млечни блатове, ванилов крем",
        prepTime: "2-3 дни",
      },
      "cake-3": {
        name: "Класически медовик",
        description:
          "Традиционна медена торта със сметанов крем. Топи се в устата.",
        weight: "1.8 кг (8-10 порции)",
        filling: "Медени блатове, сметанов крем",
        prepTime: "2 дни",
      },
      "cake-4": {
        name: "Вафлена торта",
        description:
          "Хрупкави вафлени блатове, карамелен крем и орехи за богат домашен вкус.",
        weight: "1.8 кг (8-10 порции)",
        filling: "Вафлени блатове, карамелен крем, орехи",
        prepTime: "2 дни",
      },
      "cake-5": {
        name: "Меренгов рулет",
        description: "Лек меренгов рулет с нежен крем и свежи горски плодове.",
        weight: "1.2 кг (8-10 порции)",
        filling: "Меренг, ванилов крем, горски плодове",
        prepTime: "2 дни",
      },
      "cin-1": {
        name: "Синнабон с канела",
        description:
          "Топла пухкава канелена ролка с фирмена сметанова глазура.",
        weight: "250 г",
        filling: "Канела, кафява захар",
        prepTime: "В наличност или 1 ден",
      },
      "cin-2": {
        name: "Синнабон с мак",
        description: "Пухкава канелена ролка с мак и нежна сметанова глазура.",
        weight: "280 г",
        filling: "Мак, канела, сметанова глазура",
        prepTime: "В наличност или 1 ден",
      },
      "muffin-1": {
        name: "Мъфин Baba Neagra",
        description:
          "Сочен тъмен мъфин Baba Neagra с нежен ванилов крем и вишнев топинг.",
        weight: "1 бр.",
        filling: "Baba Neagra, ванилов крем, вишни",
        prepTime: "1 ден",
      },
      "muffin-2": {
        name: "Мъфин с боровинки",
        description:
          "Пухкав ванилов мъфин с цели боровинки и хрупкави филирани бадеми.",
        weight: "1 бр.",
        filling: "Боровинки, ванилия, филирани бадеми",
        prepTime: "1 ден",
      },
    },

    features: {
      freshTitle: "Прясно изпечени",
      freshDesc: "Печем ги всеки ден с любов.",
      premiumTitle: "Качествени съставки",
      premiumDesc: "Използваме само най-добрите съставки.",
    },
    categoryCards: {
      cakesTitle: "Авторски\nТорти",
      cakesSubtitle: "Неповторим вкус\nСпециално за теб",
      cinnabonsTitle: "Сладки\nСиннабони",
      cinnabonsSubtitle: "Богати, неустоими\nизкушения",
      muffinsTitle: "Пресни\nМъфини",
      muffinsSubtitle: "Изпечени днес,\nсамо за теб",
    },
    story: {
      title: "Ръчно изработени\nс любов",
      desc: "Всеки десерт се приготвя от нулата с най-добрите съставки и се декорира със страст.",
      cta: "Нашата история",
    },
    footerNew: {
      desc: "Подсладете специалните си моменти с нашите ръчно изработени торти и десерти.",
      quickLinks: "Бързи връзки",
      customerCare: "Обслужване",
      visitUs: "Посетете ни",
      home: "Начало",
      cakes: "Торти",
      collections: "Колекции",
      about: "За нас",
      contact: "Контакти",
      faqs: "Често задавани въпроси",
      shipping: "Политика за доставка",
      returns: "Връщане и замени",
      terms: "Общи условия",
      privacy: "Поверителност",
    },

  },
  en: {
    siteDescription: "Custom cakes, cinnabons, and muffins.",
    metadataTitle: "Cakes, Cinnabons, and Muffins",
    navigation: [
      { href: "#catalog", label: "Catalog" },
      { href: "#how", label: "How to order" },
      { href: "#order", label: "Request" },
    ],
    hero: {
      badge: "Custom cakes, cinnabons, and muffins",
      title: "Life is sweeter with something homemade",
      heroTitle: "Life is Better with Something Sweet.",
      heroDesc: "Deliciously handcrafted cakes and treats made with the finest ingredients and a whole lot of love.",
      exploreCakes: "Explore Our Cakes",
      orderNow: "Order Now",
      description:
        "Choose a cake, cinnabon, or muffin, send a request, and we will confirm the details and your order.",
      catalogCta: "View catalog",
      orderCta: "Send request",
      imageAlt: "Chocolate cake with cream",
      highlights: ["Freshly baked", "Quality ingredients"],
    },
    catalog: {
      title: "Catalog",
      sections: {
        cakes: "Cakes",
        cinnabons: "Cinnabons",
        muffins: "Muffins",
      },
    },
    productCard: {
      categories: {
        cakes: "Cake",
        cinnabons: "Cinnabon",
        muffins: "Muffin",
      },
      from: "from",
      order: "Order",
      add: "Add",
      pieces: "pcs.",
      quantity: "Quantity",
      decrease: "Decrease quantity for",
      increase: "Increase quantity for",
      remove: "Remove",
      limitReached: "You can add up to 10 different products",
    },
    cart: {
      label: "Cart",
    },
    footer: {
      phone: "Phone",
      instagram: "Instagram",
      location: "Location",
      copyright: "© 2026 Stas Cakes",
    },
    orderSteps: {
      title: "How ordering works",
      steps: [
        {
          title: "1. Request",
          text: "Choose an order and leave your contact details.",
        },
        { title: "2. Details", text: "We confirm the order details." },
        {
          title: "3. Receiving",
          text: "Pickup or delivery at the agreed time.",
        },
      ],
    },
    order: {
      title: "Send a request",
      description:
        "Tell us what you want to order and for which date. We will contact you, clarify the details, and confirm the price.",
      deliveryNote: "Delivery and pickup are discussed after the request",
    },
    form: {
      name: "Name",
      phone: "Phone",
      email: "Email",
      product: "What would you like to order",
      productPlaceholder: "Choose a product",
      quantity: "Quantity",
      productComment: "Product comment",
      orderItems: "Order items",
      addProduct: "Add product",
      removeProduct: "Remove product",
      date: "Date needed",
      openCalendar: "Open calendar",
      deliveryType: "Fulfilment method",
      delivery: "Delivery",
      pickup: "Pickup",
      deliveryAddress: "Delivery address",
      comment: "Comment",
      sending: "Sending...",
      submit: "Send request",
      success: "Request sent. Next step: connect Telegram.",
      error: "Could not send the request. Check the server and try again.",
      emptyCart: "No products selected yet.",
      chooseProducts: "Choose products from the catalog",
    },
    products: {
      "cake-1": {
        name: "Napoleon with Forest Berries",
        description:
          "Delicate crisp layers, light vanilla cream, and fresh forest berries for a balanced taste.",
        weight: "1.5 kg (6-8 servings)",
        filling: "Vanilla cream, forest berries",
        prepTime: "2-3 days",
      },
      "cake-2": {
        name: "Milk Girl",
        description:
          "A delicate cake with thin milk layers and a light cream filling with a subtle vanilla flavour.",
        weight: "2 kg (10-12 servings)",
        filling: "Milk layers, vanilla cream",
        prepTime: "2-3 days",
      },
      "cake-3": {
        name: "Classic Honey Cake",
        description:
          "Traditional honey cake with sour cream custard. Melts in your mouth.",
        weight: "1.8 kg (8-10 servings)",
        filling: "Honey layers, sour cream custard",
        prepTime: "2 days",
      },
      "cake-4": {
        name: "Waffle Cake",
        description:
          "Crisp waffle layers, caramel cream, and walnuts for a rich homemade taste.",
        weight: "1.8 kg (8-10 servings)",
        filling: "Waffle layers, caramel cream, walnuts",
        prepTime: "2 days",
      },
      "cake-5": {
        name: "Meringue Roulade",
        description:
          "A light meringue roulade with delicate cream and fresh forest berries.",
        weight: "1.2 kg (8-10 servings)",
        filling: "Meringue, vanilla cream, forest berries",
        prepTime: "2 days",
      },
      "cin-1": {
        name: "Cinnamon Cinnabon",
        description: "Warm soft cinnamon roll with signature cream glaze.",
        weight: "250 g",
        filling: "Cinnamon, brown sugar",
        prepTime: "Available or 1 day",
      },
      "cin-2": {
        name: "Poppy Seed Cinnabon",
        description:
          "A soft cinnamon roll with poppy seeds and delicate cream glaze.",
        weight: "280 g",
        filling: "Poppy seeds, cinnamon, cream glaze",
        prepTime: "Available or 1 day",
      },
      "muffin-1": {
        name: "Baba Neagra Muffin",
        description:
          "A moist dark Baba Neagra muffin with delicate vanilla cream and sour cherry topping.",
        weight: "1 piece",
        filling: "Baba Neagra, vanilla cream, sour cherries",
        prepTime: "1 day",
      },
      "muffin-2": {
        name: "Blueberry Muffin",
        description:
          "A soft vanilla muffin with whole blueberries and crisp sliced almonds.",
        weight: "1 piece",
        filling: "Blueberries, vanilla, sliced almonds",
        prepTime: "1 day",
      },
    },

    features: {
      freshTitle: "Freshly Baked",
      freshDesc: "Baked fresh daily with love.",
      premiumTitle: "Premium Ingredients",
      premiumDesc: "We use only the finest quality ingredients.",
    },
    categoryCards: {
      cakesTitle: "Signature\nCakes",
      cakesSubtitle: "Timeless Flavors\nMade for You",
      cinnabonsTitle: "Sweet\nCinnabons",
      cinnabonsSubtitle: "Rich, Indulgent &\nIrresistible",
      muffinsTitle: "Fresh\nMuffins",
      muffinsSubtitle: "Baked Fresh,\nJust for You",
    },
    story: {
      title: "Handcrafted\nwith Love",
      desc: "Every dessert is baked from scratch with the finest ingredients and decorated with passion.",
      cta: "Our Story",
    },
    footerNew: {
      desc: "Sweeten your special moments with our handcrafted cakes and delightful treats.",
      quickLinks: "Quick Links",
      customerCare: "Customer Care",
      visitUs: "Visit Us",
      home: "Home",
      cakes: "Cakes",
      collections: "Collections",
      about: "About Us",
      contact: "Contact",
      faqs: "FAQs",
      shipping: "Shipping Policy",
      returns: "Returns & Refunds",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
    },

  },
  ru: {
    siteDescription: "Торты, синнабоны и маффины на заказ.",
    metadataTitle: "Торты, синнабоны и маффины",
    navigation: [
      { href: "#catalog", label: "Каталог" },
      { href: "#how", label: "Как заказать" },
      { href: "#order", label: "Заявка" },
    ],
    hero: {
      badge: "Торты, синнабоны и маффины на заказ",
      title: "Жизнь с домашней выпечкой слаще",
      heroTitle: "Жизнь лучше с чем-то сладким.",
      heroDesc: "Невероятно вкусные торты и десерты ручной работы, приготовленные из лучших ингредиентов с большой любовью.",
      exploreCakes: "Выбрать торт",
      orderNow: "Заказать",
      description:
        "Выберите торт, синнабон или маффин, оставьте заявку, а мы уточним детали и подтвердим заказ.",
      catalogCta: "Смотреть каталог",
      orderCta: "Оставить заявку",
      imageAlt: "Шоколадный торт с кремом",
      highlights: ["Свежая выпечка", "Качественные ингредиенты"],
    },
    catalog: {
      title: "Каталог",
      sections: {
        cakes: "Торты",
        cinnabons: "Синнабоны",
        muffins: "Маффины",
      },
    },
    productCard: {
      categories: {
        cakes: "Торт",
        cinnabons: "Синнабон",
        muffins: "Маффин",
      },
      from: "от",
      order: "Заказать",
      add: "Добавить",
      pieces: "шт.",
      quantity: "Количество",
      decrease: "Уменьшить количество для",
      increase: "Увеличить количество для",
      remove: "Удалить",
      limitReached: "Можно добавить не более 10 разных товаров",
    },
    cart: {
      label: "Корзина",
    },
    footer: {
      phone: "Телефон",
      instagram: "Instagram",
      location: "Местоположение",
      copyright: "© 2026 Stas Cakes",
    },
    orderSteps: {
      title: "Как работает заказ",
      steps: [
        {
          title: "1. Заявка",
          text: "Выберите заказ и оставьте ваши контакты.",
        },
        { title: "2. Уточнение", text: "Согласование заказа." },
        {
          title: "3. Получение",
          text: "Самовывоз или доставка в согласованное время.",
        },
      ],
    },
    order: {
      title: "Оставить заявку",
      description:
        "Напишите, что хотите заказать и на какую дату. Мы свяжемся с вами, уточним детали и подтвердим стоимость.",
      deliveryNote: "Доставка и самовывоз обсуждаются после заявки",
    },
    form: {
      name: "Имя",
      phone: "Телефон",
      email: "Email",
      product: "Что хотите заказать",
      productPlaceholder: "Выберите товар",
      quantity: "Количество",
      productComment: "Комментарий к товару",
      orderItems: "Товары в заказе",
      addProduct: "Добавить товар",
      removeProduct: "Удалить товар",
      date: "Дата, к которой нужен заказ",
      openCalendar: "Открыть календарь",
      deliveryType: "Способ получения",
      delivery: "Доставка",
      pickup: "Самовывоз",
      deliveryAddress: "Адрес доставки",
      comment: "Комментарий",
      sending: "Отправляем...",
      submit: "Отправить заявку",
      success: "Заявка отправлена. Следующий шаг: подключить Telegram.",
      error:
        "Не получилось отправить заявку. Проверьте сервер и попробуйте еще раз.",
      emptyCart: "Товары пока не выбраны.",
      chooseProducts: "Выбрать товары в каталоге",
    },
    products: {
      "cake-1": {
        name: "Наполеон с лесными ягодами",
        description:
          "Тонкие хрустящие коржи, лёгкий ванильный крем и свежие лесные ягоды для сбалансированного вкуса.",
        weight: "1.5 кг (6-8 порций)",
        filling: "Ванильный крем, лесные ягоды",
        prepTime: "2-3 дня",
      },
      "cake-2": {
        name: "Молочная девочка",
        description:
          "Нежный торт из тонких молочных коржей и лёгкого крема с деликатным ванильным вкусом.",
        weight: "2 кг (10-12 порций)",
        filling: "Молочные коржи, ванильный крем",
        prepTime: "2-3 дня",
      },
      "cake-3": {
        name: "Медовик Классический",
        description:
          "Традиционный медовый торт с заварным сметанным кремом. Тает во рту.",
        weight: "1.8 кг (8-10 порций)",
        filling: "Медовые коржи, сметанно-заварной крем",
        prepTime: "2 дня",
      },
      "cake-4": {
        name: "Вафельный торт",
        description:
          "Хрустящие вафельные коржи, карамельный крем и грецкие орехи для насыщенного домашнего вкуса.",
        weight: "1.8 кг (8-10 порций)",
        filling: "Вафельные коржи, карамельный крем, грецкие орехи",
        prepTime: "2 дня",
      },
      "cake-5": {
        name: "Меренговый рулет",
        description:
          "Лёгкий меренговый рулет с нежным кремом и свежими лесными ягодами.",
        weight: "1.2 кг (8-10 порций)",
        filling: "Меренга, ванильный крем, лесные ягоды",
        prepTime: "2 дня",
      },
      "cin-1": {
        name: "Синнабон с корицей",
        description:
          "Горячая сдобная булочка с корицей макара и фирменной сливочной глазурью.",
        weight: "250 г",
        filling: "Корица, тростниковый сахар",
        prepTime: "В наличии (или 1 день)",
      },
      "cin-2": {
        name: "Синнабон с маком",
        description:
          "Пышная булочка с корицей, маком и нежной сливочной глазурью.",
        weight: "280 г",
        filling: "Мак, корица, сливочная глазурь",
        prepTime: "В наличии (или 1 день)",
      },
      "muffin-1": {
        name: "Маффин Baba Neagra",
        description:
          "Сочный тёмный маффин Baba Neagra с нежным ванильным кремом и вишнёвым топпингом.",
        weight: "1 шт.",
        filling: "Baba Neagra, ванильный крем, вишня",
        prepTime: "1 день",
      },
      "muffin-2": {
        name: "Маффин с черникой",
        description:
          "Мягкий ванильный маффин с цельной черникой и хрустящими миндальными лепестками.",
        weight: "1 шт.",
        filling: "Черника, ваниль, миндальные лепестки",
        prepTime: "1 день",
      },
    },

    features: {
      freshTitle: "Freshly Baked",
      freshDesc: "Baked fresh daily with love.",
      premiumTitle: "Premium Ingredients",
      premiumDesc: "We use only the finest quality ingredients.",
    },
    categoryCards: {
      cakesTitle: "Signature\nCakes",
      cakesSubtitle: "Timeless Flavors\nMade for You",
      cinnabonsTitle: "Sweet\nCinnabons",
      cinnabonsSubtitle: "Rich, Indulgent &\nIrresistible",
      muffinsTitle: "Fresh\nMuffins",
      muffinsSubtitle: "Baked Fresh,\nJust for You",
    },
    story: {
      title: "Handcrafted\nwith Love",
      desc: "Every dessert is baked from scratch with the finest ingredients and decorated with passion.",
      cta: "Our Story",
    },
    footerNew: {
      desc: "Sweeten your special moments with our handcrafted cakes and delightful treats.",
      quickLinks: "Quick Links",
      customerCare: "Customer Care",
      visitUs: "Visit Us",
      home: "Home",
      cakes: "Cakes",
      collections: "Collections",
      about: "About Us",
      contact: "Contact",
      faqs: "FAQs",
      shipping: "Shipping Policy",
      returns: "Returns & Refunds",
      terms: "Terms & Conditions",
      privacy: "Privacy Policy",
    },

  },
};
