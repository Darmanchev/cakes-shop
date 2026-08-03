import {parsePhoneNumberFromString} from 'libphonenumber-js/core';
import phoneMetadata from 'libphonenumber-js/metadata.max.json';
import {z} from 'zod';

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
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Sofia',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

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

const orderItemSchema = z.object({
    productId: z
        .string()
        .trim()
        .min(1, 'Изберете продукт'),

    quantity: z.coerce
        .number()
        .int('Бройката трябва да бъде цяло число')
        .min(1)
        .max(20),

    comment: z
        .string()
        .trim()
        .max(500, 'Коментарът към продукта е твърде дълъг')
        .optional(),
}).strict();

export const createOrderSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Въведете име')
        .max(100, 'Името е твърде дълго'),

    phone: z
        .string()
        .trim()
        .max(32, 'Телефонният номер е твърде дълъг')
        .refine((value) => {
            const phone = parsePhoneNumberFromString(value, 'BG', phoneMetadata);

            return phone?.isValid() ?? false;
        }, 'Въведете коректен телефонен номер'),

    email: z
        .string()
        .trim()
        .email('Въведете email')
        .max(254, 'Email адресът е твърде дълъг'),

    items: z.array(orderItemSchema)
        .min(1, 'Добавете поне един продукт')
        .max(10, 'Можете да добавите най-много 10 продукта'),

    date: z
        .string()
        .transform(normalizeOrderDate)
        .superRefine((value, context) => {
            if (!value) {
                context.addIssue({
                    code: 'custom',
                    message: 'Изберете дата',
                });

                return;
            }

            if (!isValidIsoDate(value)) {
                context.addIssue({
                    code: 'custom',
                    message: 'Въведете валидна дата',
                });

                return;
            }

            if (value < getTodayInSofia()) {
                context.addIssue({
                    code: 'custom',
                    message: 'Датата не може да бъде в миналото',
                });
            } else if (value > addDaysToIsoDate(getTodayInSofia(), MAX_ORDER_ADVANCE_DAYS)) {
                context.addIssue({
                    code: 'custom',
                    message: `Датата не може да бъде след повече от ${MAX_ORDER_ADVANCE_DAYS} дни`,
                });
            }
        }),

    deliveryType: z.enum(['DELIVERY', 'PICKUP'], {
        message: 'Изберете доставка или вземане на място',
    }),

    deliveryAddress: z
        .string()
        .trim()
        .max(300, 'Адресът е твърде дълъг'),

    comment: z
        .string()
        .trim()
        .max(500).optional(),
}).strict().superRefine((order, context) => {
    if (order.deliveryType === 'DELIVERY' && order.deliveryAddress.length < 5) {
        context.addIssue({
            code: 'custom',
            path: ['deliveryAddress'],
            message: 'Въведете адрес на доставка',
        });
    }
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export function parseCreateOrderInput(value: unknown) {
    const result = createOrderSchema.safeParse(value);

    if (!result.success) {
        return {
            success: false as const,
            fieldErrors: z.flattenError(result.error).fieldErrors,
        };
    }

    const phone = parsePhoneNumberFromString(result.data.phone, 'BG', phoneMetadata);

    return {
        success: true as const,
        data: {
            ...result.data,
            phone: phone?.number.toString() ?? result.data.phone,
        },
    };
}
