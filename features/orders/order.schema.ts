import { parsePhoneNumberFromString} from 'libphonenumber-js';
import { z } from 'zod';

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
      .min(1, 'Изберете дата'),

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
