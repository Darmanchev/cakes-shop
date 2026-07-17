import { prisma } from '@/lib/prisma';
import { formatOrderTelegramMessage, sendTelegramMessage } from './order.notifications';
import type { CreateOrderInput } from './order.schema';
import { Currency, type OrderStatus } from '@prisma/client';

export async function createOrder(order: CreateOrderInput) {
    const createdOrder = await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({
            where: {
                id: order.productId,
            },
            select: {
                name: true,
                priceMinor: true,
            },
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return tx.order.create({
            data: {
                name: order.name,
                phone: order.phone,
                email: order.email,
                quantity: order.quantity,
                deliveryAddress: order.deliveryAddress,
                productId: order.productId,
                productName: product.name,
                unitPriceMinor: product.priceMinor,
                currency: Currency.EUR,
                totalMinor: product.priceMinor * order.quantity,
                date: new Date(order.date),
                comment: order.comment || null,
            },
            include: {
                product: true,
            },
        });
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

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
}
