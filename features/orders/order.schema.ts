import { parsePhoneNumberFromString } from "libphonenumber-js/core";
import phoneMetadata from "libphonenumber-js/metadata.max.json";
import { z } from "zod";
import { MAX_CART_ITEMS, MAX_CART_ITEM_QUANTITY } from "@/features/cart/cart.schema";
import { defaultLanguage, type Language } from "@/lib/i18n";

const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_ORDER_ADVANCE_DAYS = 365;

function isValidIsoDate(value: string) {
  if (!ISO_DATE_FORMAT.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function getTodayInSofia() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Sofia",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function addDaysToIsoDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);

  return date.toISOString().slice(0, 10);
}

function normalizeOrderDate(value: string) {
  const trimmed = value.trim();
  const match = /^(\d{2})[./-](\d{2})[./-](\d{4})$/.exec(trimmed);

  if (!match) {
    return trimmed;
  }

  return `${match[3]}-${match[2]}-${match[1]}`;
}

interface OrderValidationMessages {
  productRequired: string;
  quantityInteger: string;
  quantityMin: string;
  quantityMax: string;
  productCommentTooLong: string;
  nameRequired: string;
  nameTooLong: string;
  phoneTooLong: string;
  phoneInvalid: string;
  emailInvalid: string;
  emailTooLong: string;
  itemsRequired: string;
  itemsTooMany: string;
  itemsUnique: string;
  dateRequired: string;
  dateInvalid: string;
  datePast: string;
  dateTooFar: string;
  deliveryTypeInvalid: string;
  addressTooLong: string;
  addressRequired: string;
  commentTooLong: string;
}

const validationMessages: Record<Language, OrderValidationMessages> = {
  bg: {
    productRequired: "Изберете продукт",
    quantityInteger: "Бройката трябва да бъде цяло число",
    quantityMin: "Бройката трябва да бъде поне 1",
    quantityMax: `Бройката не може да бъде повече от ${MAX_CART_ITEM_QUANTITY}`,
    productCommentTooLong: "Коментарът към продукта е твърде дълъг",
    nameRequired: "Въведете име",
    nameTooLong: "Името е твърде дълго",
    phoneTooLong: "Телефонният номер е твърде дълъг",
    phoneInvalid: "Въведете коректен телефонен номер",
    emailInvalid: "Въведете валиден имейл",
    emailTooLong: "Имейл адресът е твърде дълъг",
    itemsRequired: "Добавете поне един продукт",
    itemsTooMany: `Можете да добавите най-много ${MAX_CART_ITEMS} продукта`,
    itemsUnique: "Всеки продукт може да присъства само веднъж",
    dateRequired: "Изберете дата",
    dateInvalid: "Въведете валидна дата",
    datePast: "Датата не може да бъде в миналото",
    dateTooFar: `Датата не може да бъде след повече от ${MAX_ORDER_ADVANCE_DAYS} дни`,
    deliveryTypeInvalid: "Изберете доставка или вземане на място",
    addressTooLong: "Адресът е твърде дълъг",
    addressRequired: "Въведете адрес на доставка",
    commentTooLong: "Коментарът е твърде дълъг",
  },
  en: {
    productRequired: "Choose a product",
    quantityInteger: "Quantity must be a whole number",
    quantityMin: "Quantity must be at least 1",
    quantityMax: `Quantity cannot exceed ${MAX_CART_ITEM_QUANTITY}`,
    productCommentTooLong: "The product comment is too long",
    nameRequired: "Enter your name",
    nameTooLong: "The name is too long",
    phoneTooLong: "The phone number is too long",
    phoneInvalid: "Enter a valid phone number",
    emailInvalid: "Enter a valid email address",
    emailTooLong: "The email address is too long",
    itemsRequired: "Add at least one product",
    itemsTooMany: `You can add up to ${MAX_CART_ITEMS} products`,
    itemsUnique: "Each product can appear only once",
    dateRequired: "Choose a date",
    dateInvalid: "Enter a valid date",
    datePast: "The date cannot be in the past",
    dateTooFar: `The date cannot be more than ${MAX_ORDER_ADVANCE_DAYS} days away`,
    deliveryTypeInvalid: "Choose delivery or pickup",
    addressTooLong: "The address is too long",
    addressRequired: "Enter a delivery address",
    commentTooLong: "The comment is too long",
  },
  ru: {
    productRequired: "Выберите товар",
    quantityInteger: "Количество должно быть целым числом",
    quantityMin: "Количество должно быть не меньше 1",
    quantityMax: `Количество не может превышать ${MAX_CART_ITEM_QUANTITY}`,
    productCommentTooLong: "Комментарий к товару слишком длинный",
    nameRequired: "Введите имя",
    nameTooLong: "Имя слишком длинное",
    phoneTooLong: "Номер телефона слишком длинный",
    phoneInvalid: "Введите корректный номер телефона",
    emailInvalid: "Введите корректный email",
    emailTooLong: "Email слишком длинный",
    itemsRequired: "Добавьте хотя бы один товар",
    itemsTooMany: `Можно добавить не более ${MAX_CART_ITEMS} товаров`,
    itemsUnique: "Каждый товар может быть добавлен только один раз",
    dateRequired: "Выберите дату",
    dateInvalid: "Введите корректную дату",
    datePast: "Дата не может быть в прошлом",
    dateTooFar: `Дата не может быть позже, чем через ${MAX_ORDER_ADVANCE_DAYS} дней`,
    deliveryTypeInvalid: "Выберите доставку или самовывоз",
    addressTooLong: "Адрес слишком длинный",
    addressRequired: "Введите адрес доставки",
    commentTooLong: "Комментарий слишком длинный",
  },
};

function createOrderSchemaFor(language: Language) {
  const messages = validationMessages[language];
  const orderItemSchema = z
    .object({
      productId: z
        .string({ error: messages.productRequired })
        .trim()
        .min(1, messages.productRequired),
      quantity: z
        .union(
          [
            z.number({ error: messages.quantityInteger }),
            z.string({ error: messages.quantityInteger }).trim().min(1),
          ],
          { error: messages.quantityInteger },
        )
        .transform(Number)
        .pipe(
          z
            .number({ error: messages.quantityInteger })
            .int(messages.quantityInteger)
            .min(1, messages.quantityMin)
            .max(MAX_CART_ITEM_QUANTITY, messages.quantityMax),
        ),
      comment: z
        .string()
        .trim()
        .max(500, messages.productCommentTooLong)
        .optional(),
    })
    .strict();

  return z
    .object({
      name: z
        .string({ error: messages.nameRequired })
        .trim()
        .min(2, messages.nameRequired)
        .max(100, messages.nameTooLong),
      phone: z
        .string({ error: messages.phoneInvalid })
        .trim()
        .max(32, messages.phoneTooLong)
        .refine((value) => {
          const phone = parsePhoneNumberFromString(value, "BG", phoneMetadata);

          return phone?.isValid() ?? false;
        }, messages.phoneInvalid),
      email: z
        .string({ error: messages.emailInvalid })
        .trim()
        .email(messages.emailInvalid)
        .max(254, messages.emailTooLong),
      items: z
        .array(orderItemSchema, { error: messages.itemsRequired })
        .min(1, messages.itemsRequired)
        .max(MAX_CART_ITEMS, messages.itemsTooMany)
        .refine(
          (items) =>
            new Set(items.map((item) => item.productId)).size === items.length,
          messages.itemsUnique,
        ),
      date: z
        .string({ error: messages.dateRequired })
        .transform(normalizeOrderDate)
        .superRefine((value, context) => {
          if (!value) {
            context.addIssue({ code: "custom", message: messages.dateRequired });
            return;
          }

          if (!isValidIsoDate(value)) {
            context.addIssue({ code: "custom", message: messages.dateInvalid });
            return;
          }

          if (value < getTodayInSofia()) {
            context.addIssue({ code: "custom", message: messages.datePast });
          } else if (
            value > addDaysToIsoDate(getTodayInSofia(), MAX_ORDER_ADVANCE_DAYS)
          ) {
            context.addIssue({ code: "custom", message: messages.dateTooFar });
          }
        }),
      deliveryType: z.enum(["DELIVERY", "PICKUP"], {
        error: messages.deliveryTypeInvalid,
      }),
      deliveryAddress: z
        .string({ error: messages.addressRequired })
        .trim()
        .max(300, messages.addressTooLong)
        .default(""),
      comment: z
        .string()
        .trim()
        .max(500, messages.commentTooLong)
        .optional(),
    })
    .strict()
    .superRefine((order, context) => {
      if (
        order.deliveryType === "DELIVERY" &&
        order.deliveryAddress.length < 5
      ) {
        context.addIssue({
          code: "custom",
          path: ["deliveryAddress"],
          message: messages.addressRequired,
        });
      }
    });
}

export const createOrderSchema = createOrderSchemaFor(defaultLanguage);

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export function parseCreateOrderInput(
  value: unknown,
  language: Language = defaultLanguage,
) {
  const result = createOrderSchemaFor(language).safeParse(value);

  if (!result.success) {
    return {
      success: false as const,
      fieldErrors: z.flattenError(result.error).fieldErrors,
    };
  }

  const phone = parsePhoneNumberFromString(
    result.data.phone,
    "BG",
    phoneMetadata,
  );

  return {
    success: true as const,
    data: {
      ...result.data,
      phone: phone?.number.toString() ?? result.data.phone,
    },
  };
}
