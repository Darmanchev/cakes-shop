import { parsePhoneNumberFromString} from 'libphonenumber-js';
import { z } from 'zod';

export const createOrderSchema = z.object({
  name: z.string().trim().min(2, 'Введите имя'),
  phone: z.string().trim().refine((value) => {
    const phone = parsePhoneNumberFromString(value, 'BG');

    return phone?.isValid() ?? false;
  }, 'Введите корректный номер телефона'),
  productId: z.string().trim().min(1, 'Выберите товар'),
  date: z.string().trim().min(1, 'Выберите дату'),
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
