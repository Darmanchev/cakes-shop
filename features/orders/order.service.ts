import type { CreateOrderInput } from './order.types';
import { prisma } from '@/lib/prisma';
import { formatOrderTelegramMessage, sendTelegramMessage } from './order.notifications';

export async function createOrder(order: CreateOrderInput) {
  const createdOrder = await prisma.order.create({
    data: {
      name: order.name,
      phone: order.phone,
      productId: order.productId,
      date: new Date(order.date),
      comment: order.comment || null,
    },
    include: {
      product: true,
    },
  });

  try {
    await sendTelegramMessage(formatOrderTelegramMessage(createdOrder));
  } catch (error) {
    console.error(error);
  }

  return createdOrder;
}

export async function getOrders() {
  return prisma.order.findMany({
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}