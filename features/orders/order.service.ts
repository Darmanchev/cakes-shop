import { prisma } from '@/lib/prisma';
import type { CreateOrderInput } from './order.schema';
import { Currency, type Order, type OrderItem, type OrderStatus } from '@prisma/client';
import {decryptOrderPii, decryptPii, encryptOrderPii, encryptPii} from '@/lib/security/pii';

export class ProductNotFoundError extends Error {
    constructor() {
        super('Product not found');
        this.name = 'ProductNotFoundError';
    }
}

export type OrderWithItems = Order & {items: OrderItem[]};

function decryptOrderWithItems(order: OrderWithItems): OrderWithItems {
    return {
        ...decryptOrderPii(order),
        items: order.items.map((item) => ({
            ...item,
            comment: item.comment === null ? null : decryptPii(item.comment),
        })),
    };
}

export async function createOrder(order: CreateOrderInput) {
    await deleteExpiredOrders();

    const createdOrder = await prisma.$transaction(async (tx) => {
        const productIds = [...new Set(order.items.map((item) => item.productId))];
        const products = await tx.product.findMany({
            where: {
                id: {in: productIds},
            },
            select: {
                id: true,
                name: true,
                priceMinor: true,
            },
        });

        if (products.length !== productIds.length) {
            throw new ProductNotFoundError();
        }

        const productsById = new Map(products.map((product) => [product.id, product]));
        const items = order.items.map((item) => {
            const product = productsById.get(item.productId);

            if (!product) {
                throw new ProductNotFoundError();
            }

            const totalMinor = product.priceMinor * item.quantity;
            if (!Number.isSafeInteger(totalMinor) || totalMinor > 2_147_483_647) {
                throw new Error('Order item total is outside the supported range');
            }

            return {
                productId: product.id,
                productName: product.name,
                unitPriceMinor: product.priceMinor,
                quantity: item.quantity,
                totalMinor,
                comment: item.comment ? encryptPii(item.comment) : null,
            };
        });
        const totalMinor = items.reduce((total, item) => total + item.totalMinor, 0);

        if (!Number.isSafeInteger(totalMinor) || totalMinor > 2_147_483_647) {
            throw new Error('Order total is outside the supported range');
        }

        const firstItem = items[0];

        const encrypted = encryptOrderPii({
            name: order.name,
            phone: order.phone,
            email: order.email,
            deliveryAddress: order.deliveryAddress,
            comment: order.comment || null,
        });

        return tx.order.create({
            data: {
                name: encrypted.name,
                phone: encrypted.phone,
                email: encrypted.email,
                quantity: firstItem.quantity,
                deliveryType: order.deliveryType,
                deliveryAddress: encrypted.deliveryAddress,
                productId: firstItem.productId,
                productName: firstItem.productName,
                unitPriceMinor: firstItem.unitPriceMinor,
                currency: Currency.EUR,
                totalMinor,
                date: new Date(order.date),
                comment: encrypted.comment,
                items: {create: items},
            },
            include: {items: true},
        });
    });

    return decryptOrderWithItems(createdOrder);
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
            include: {items: true},
        }),
        prisma.order.count(),
    ]);

    return {
        items: items.map(decryptOrderWithItems),
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
