import { parsePhoneNumberFromString} from 'libphonenumber-js';
import { z } from 'zod';

const ISO_DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value: string) {
    if (!ISO_DATE_FORMAT.test(value)) {
        return false;
    }

    const date = new Date(`${value}T00:00:000Z`);

    return (
        !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    )
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


export const createOrderSchema = z.object({
  name: z
      .string()
      .trim()
      .min(2, 'Въведете име'),

  phone: z
      .string()
      .trim()
      .refine((value) => {
        const phone = parsePhoneNumberFromString(value, 'BG');

        return phone?.isValid() ?? false;
      }, 'Въведете коректен телефонен номер'),

  email: z
      .string()
      .trim()
      .email('Въведете email'),

  quantity: z.coerce
      .number()
      .int('Бройка трябва да бъде целя число')
      .min(1)
      .max(20),

  productId: z
      .string()
      .trim()
      .min(1, 'Изберете продукт'),

  date: z
      .string()
      .trim()
      .superRefine((value, context) => {
          if (!value) {
              context.addIssue({
                  code: 'custom',
                  message: 'Изберете дата',
              })

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
          }
      }),

  deliveryAddress: z
      .string()
      .trim()
      .min(5, 'Въведети адрес на доставка'),

  comment: z
      .string()
      .trim()
      .max(500).optional(),
  });

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export function parseCreateOrderInput(value: unknown): CreateOrderInput | null {
  const result = createOrderSchema.safeParse(value);

  if (!result.success) {
    return null;
  }

  const phone = parsePhoneNumberFromString(result.data.phone, 'BG');

  return {
    ...result.data,
    phone: phone?.number.toString() ?? result.data.phone,
  };

}
