import { prisma } from '@/lib/prisma';
import type { CreateOrderInput } from './order.schema';
import { Currency, type OrderStatus } from '@prisma/client';

export class ProductNotFoundError extends Error {
    constructor() {
        super('Product not found');
        this.name = 'ProductNotFoundError';
    }
}

export async function createOrder(order: CreateOrderInput) {
    await deleteExpiredOrders();

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
            throw new ProductNotFoundError();
        }

        return tx.order.create({
            data: {
                name: order.name,
                phone: order.phone,
                email: order.email,
                quantity: order.quantity,
                deliveryType: order.deliveryType,
                deliveryAddress: order.deliveryAddress,
                productId: order.productId,
                productName: product.name,
                unitPriceMinor: product.priceMinor,
                currency: Currency.EUR,
                totalMinor: product.priceMinor * order.quantity,
                date: new Date(order.date),
                comment: order.comment || null,
            }
        });
    });

    return createdOrder;
}

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;
const DEFAULT_RETENTION_DAYS = 365;

function getRetentionDays() {
    const configuredDays = Number(process.env.ORDER_RETENTION_DAYS ?? DEFAULT_RETENTION_DAYS);

    if (!Number.isInteger(configuredDays) || configuredDays < 30 || configuredDays > 3650) {
        throw new Error('ORDER_RETENTION_DAYS must be an integer between 30 and 3650');
    }

    return configuredDays;
}

async function deleteExpiredOrders() {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - getRetentionDays());

    await prisma.order.deleteMany({
        where: {createdAt: {lt: cutoff}},
    });
}

export async function getOrders(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const safePage = Math.max(1, Math.trunc(page));
    const safePageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, Math.trunc(pageSize)));

    await deleteExpiredOrders();

    const [items, total] = await prisma.$transaction([
        prisma.order.findMany({
            orderBy: {createdAt: 'desc'},
            skip: (safePage - 1) * safePageSize,
            take: safePageSize,
        }),
        prisma.order.count(),
    ]);

    return {
        items,
        total,
        page: safePage,
        pageCount: Math.max(1, Math.ceil(total / safePageSize)),
    };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
        where: { id: orderId },
        data: { status }
    });
}
