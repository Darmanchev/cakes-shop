import type { Order, Product } from '@prisma/client'

type OrderWithProduct = Order & {
    product: Product;
};

function formatOrderDate(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
    }).format(date);
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
}

export function formatOrderTelegramMessage(order: OrderWithProduct) {
    const comment = order.comment ? escapeHtml(order.comment) : '-';

    return [
        '<b>New order</b>',
        '',
        `<b>Client:</b> ${escapeHtml(order.name)}`,
        `<b>Телефон:</b> ${escapeHtml(order.phone)}`,
        `<b>Товар:</b> ${escapeHtml(order.product.name)}`,
        `<b>Дата:</b> ${formatOrderDate(order.date)}`,
        `<b>Комментарий:</b> ${comment}`,
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