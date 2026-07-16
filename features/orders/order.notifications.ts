import type {Order, Product} from '@prisma/client';
import {translations} from '@/lib/i18n';

type OrderWithProduct = Order & {
    product: Product;
};

function formatOrderDate(date: Date) {
    return new Intl.DateTimeFormat('bg-BG', {
        dateStyle: 'medium',
    }).format(date);
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

export function formatOrderTelegramMessage(order: OrderWithProduct) {
    const comment = order.comment ? escapeHtml(order.comment) : '-';
    const productName = translations.bg.products[order.product.id]?.name ?? order.product.name;

    return [
        '<b>Нова поръчка</b>',
        '',
        `<b>Клиент:</b> ${escapeHtml(order.name)}`,
        `<b>Телефон:</b> ${escapeHtml(order.phone)}`,
        `<b>Email:</b> ${escapeHtml(order.email)}`,
        `<b>Продукт:</b> ${escapeHtml(productName)}`,
        `<b>Брой:</b> ${order.quantity}`,
        `<b>Дата:</b> ${formatOrderDate(order.date)}`,
        `<b>Адрес за доставка:</b> ${escapeHtml(order.deliveryAddress)}`,
        `<b>Коментар:</b> ${comment}`,
    ].join('\n');
}

export async function sendTelegramMessage(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return;
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Telegram notification failed: ${errorText}`);
    }
}
