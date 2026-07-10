import { parsePhoneNumberFromString} from 'libphonenumber-js';
import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string().trim().min(2, 'Въведете име'),
  phone: z.string().trim().refine((value) => {
    const phone = parsePhoneNumberFromString(value, 'BG');

    return phone?.isValid() ?? false;
  }, 'Въведете коректен телефонен номер'),
  productId: z.string().trim().min(1, 'Изберете продукт'),
  date: z.string().trim().min(1, 'Изберете дата'),
  comment: z.string().trim().optional(),
  });

export function parseCreateOrderInput(value: unknown) {
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
