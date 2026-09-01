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
    description: string;
    catalogCta: string;
    orderCta: string;
    imageAlt: string;
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
    increase: string;
    remove: string;
    limitReached: string;
  };
  cart: {
    label: string;
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
}

export const translations: Record<Language, AppTranslations> = {
  bg: {
    siteDescription: "Торти, синнабони и сладки сетове по поръчка.",
    metadataTitle: "Торти и синнабони",
    navigation: [
      { href: "#catalog", label: "Каталог" },
      { href: "#how", label: "Как се поръчва" },
      { href: "#order", label: "Запитване" },
    ],
    hero: {
      badge: "Торти и синнабони по поръчка",
      title: "Домашни сладкиши за празници, срещи и уютни вечери",
      description:
        "Изберете торта, синнабон или сет, оставете запитване, а ние ще уточним детайлите и ще потвърдим поръчката.",
      catalogCta: "Виж каталога",
      orderCta: "Остави запитване",
      imageAlt: "Шоколадова торта с крем",
    },
    catalog: {
      title: "Каталог",
      sections: {
        cakes: "Торти",
        cinnabons: "Синнабони",
        combos: "Сетове",
      },
    },
    productCard: {
      categories: {
        cakes: "Торта",
        cinnabons: "Синнабон",
        combos: "Сет",
      },
      from: "от",
      order: "Поръчай",
      add: "Добави",
      pieces: "бр.",
      quantity: "Количество",
      increase: "Увеличи количеството за",
      remove: "Премахни",
      limitReached: "Можете да добавите най-много 10 различни продукта",
    },
    cart: {
      label: "Кошница",
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
      "cin-3": {
        name: "Плодов синнабон",
        description: "Пухкава ролка с домашно малиново сладко и крем чийз.",
        weight: "260 г",
        filling: "Малина, крема сирене",
        prepTime: "В наличност или 1 ден",
      },
      "combo-1": {
        name: 'Сет "Уютна вечер"',
        description:
          "Кутия с 6 пресни синнабона: 3 класически и 3 шоколадови. Добър избор за компания.",
        weight: "1.5 кг",
        prepTime: "1 ден",
      },
      "combo-2": {
        name: "Празничен сет",
        description:
          "Асорти от 9 мини синнабона с различни вкусове. Подходящо за голяма маса.",
        weight: "1.8 кг",
        prepTime: "1 ден",
      },
      "combo-3": {
        name: "Сет за двама",
        description:
          "2 синнабона по избор и 2 порции филтър кафе или авторски чай.",
        weight: "800 г",
        prepTime: "В наличност",
      },
    },
  },
  en: {
    siteDescription: "Custom cakes, cinnabons, and sweet sets.",
    metadataTitle: "Cakes and Cinnabons",
    navigation: [
      { href: "#catalog", label: "Catalog" },
      { href: "#how", label: "How to order" },
      { href: "#order", label: "Request" },
    ],
    hero: {
      badge: "Custom cakes and cinnabons",
      title: "Homemade bakes for celebrations, meetups, and quiet evenings",
      description:
        "Choose a cake, cinnabon, or set, send a request, and we will confirm the details and your order.",
      catalogCta: "View catalog",
      orderCta: "Send request",
      imageAlt: "Chocolate cake with cream",
    },
    catalog: {
      title: "Catalog",
      sections: {
        cakes: "Cakes",
        cinnabons: "Cinnabons",
        combos: "Sets",
      },
    },
    productCard: {
      categories: {
        cakes: "Cake",
        cinnabons: "Cinnabon",
        combos: "Set",
      },
      from: "from",
      order: "Order",
      add: "Add",
      pieces: "pcs.",
      quantity: "Quantity",
      increase: "Increase quantity for",
      remove: "Remove",
      limitReached: "You can add up to 10 different products",
    },
    cart: {
      label: "Cart",
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
      "cin-3": {
        name: "Berry Cinnabon",
        description:
          "Soft roll with homemade raspberry confit and cream cheese topping.",
        weight: "260 g",
        filling: "Raspberry, cream cheese",
        prepTime: "Available or 1 day",
      },
      "combo-1": {
        name: "Cozy Evening Set",
        description:
          "A box of 6 fresh cinnabons: 3 classic and 3 chocolate. Great for sharing.",
        weight: "1.5 kg",
        prepTime: "1 day",
      },
      "combo-2": {
        name: "Celebration Set",
        description:
          "Assortment of 9 mini cinnabons in different flavors. A good option for a big table.",
        weight: "1.8 kg",
        prepTime: "1 day",
      },
      "combo-3": {
        name: "Set for Two",
        description:
          "2 cinnabons of your choice and 2 portions of filter coffee or signature tea.",
        weight: "800 g",
        prepTime: "Available",
      },
    },
  },
  ru: {
    siteDescription: "Торты, синнабоны и наборы на заказ.",
    metadataTitle: "Торты и синнабоны",
    navigation: [
      { href: "#catalog", label: "Каталог" },
      { href: "#how", label: "Как заказать" },
      { href: "#order", label: "Заявка" },
    ],
    hero: {
      badge: "Торты и синнабоны на заказ",
      title: "Домашняя выпечка для праздников, встреч и уютных вечеров",
      description:
        "Выберите торт, синнабон или набор, оставьте заявку, а мы уточним детали и подтвердим заказ.",
      catalogCta: "Смотреть каталог",
      orderCta: "Оставить заявку",
      imageAlt: "Шоколадный торт с кремом",
    },
    catalog: {
      title: "Каталог",
      sections: {
        cakes: "Торты",
        cinnabons: "Синнабоны",
        combos: "Наборы",
      },
    },
    productCard: {
      categories: {
        cakes: "Торт",
        cinnabons: "Синнабон",
        combos: "Набор",
      },
      from: "от",
      order: "Заказать",
      add: "Добавить",
      pieces: "шт.",
      quantity: "Количество",
      increase: "Увеличить количество для",
      remove: "Удалить",
      limitReached: "Можно добавить не более 10 разных товаров",
    },
    cart: {
      label: "Корзина",
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
      "cin-3": {
        name: "Синнабон Ягодный",
        description:
          "Сдобная булочка с домашним малиновым конфитюром и шапкой из крем-чиза.",
        weight: "260 г",
        filling: "Малина, сливочный сыр",
        prepTime: "В наличии (или 1 день)",
      },
      "combo-1": {
        name: 'Сет "Уютный вечер"',
        description:
          "Коробочка из 6 свежих синнабонов (3 классических, 3 шоколадных). Идеально для компании.",
        weight: "1.5 кг",
        prepTime: "1 день",
      },
      "combo-2": {
        name: 'Сет "Праздничный"',
        description:
          "Ассорти из 9 мини-синнабонов разных вкусов. Отличный вариант для большого стола.",
        weight: "1.8 кг",
        prepTime: "1 день",
      },
      "combo-3": {
        name: 'Сет "Для двоих"',
        description:
          "2 синнабона на выбор и 2 порции фильтр-кофе или авторского чая.",
        weight: "800 г",
        prepTime: "В наличии",
      },
    },
  },
};
