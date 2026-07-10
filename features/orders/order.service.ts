import type { CreateOrderInput } from './order.types';

export async function createOrder(order: CreateOrderInput) {
  // Позже здесь будет запись в БД и отправка уведомления в Telegram.
  console.log('New cake shop order:', order);

  return order;
}
