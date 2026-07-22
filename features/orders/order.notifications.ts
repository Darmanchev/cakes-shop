import type { Order } from '@prisma/client';
import { formatPrice } from '@/lib/utils/format-price';

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

export function formatOrderTelegramMessage(order: Order) {
    const unitPrice = formatPrice(order.unitPriceMinor, 'bg');
    const total = formatPrice(order.totalMinor, 'bg');

    return [
        '<b>Нова поръчка</b>',
        '',
        `<b>Номер:</b> ${escapeHtml(order.id)}`,
        `<b>Продукт:</b> ${escapeHtml(order.productName)}`,
        `<b>Единична цена:</b> ${unitPrice}`,
        `<b>Брой:</b> ${order.quantity}`,
        `<b>Общо:</b> ${total}`,
        `<b>Дата:</b> ${formatOrderDate(order.date)}`,
        `<b>Получаване:</b> ${order.deliveryType === 'DELIVERY' ? 'Доставка' : 'Вземане на място'}`,
        '',
        'Личните данни са достъпни само в админ панела.',
    ].join('\n');
}

export async function sendTelegramMessage(message: string) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
        return;
    }

    let lastError: unknown;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        let shouldRetry = true;

        try {
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
                signal: AbortSignal.timeout(5_000),
            });

            if (response.ok) {
                return;
            }

            const errorText = (await response.text()).slice(0, 500);
            lastError = new Error(`Telegram notification failed (${response.status}): ${errorText}`);

            if (response.status < 500 && response.status !== 429) {
                shouldRetry = false;
            }
        } catch (error) {
            lastError = error;
        }

        if (!shouldRetry) {
            break;
        }

        if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 250));
        }
    }

    throw lastError instanceof Error
        ? lastError
        : new Error('Telegram notification failed');
}
