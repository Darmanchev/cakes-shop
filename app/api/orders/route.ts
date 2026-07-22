import {after, NextResponse} from 'next/server';
import {parseCreateOrderInput} from '@/features/orders/order.schema';
import {createOrder, ProductNotFoundError} from '@/features/orders/order.service';
import {formatOrderTelegramMessage, sendTelegramMessage} from '@/features/orders/order.notifications';
import {RequestBodyError, readJsonBody} from '@/lib/http/read-json-body';
import {consumeRateLimit, getClientIdentifier} from '@/lib/security/rate-limit';

const MAX_BODY_BYTES = 16 * 1024;
const ORDER_RATE_LIMIT = 5;
const ORDER_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
    const rateLimit = await consumeRateLimit({
        scope: 'create-order',
        identifier: getClientIdentifier(request.headers),
        limit: ORDER_RATE_LIMIT,
        windowMs: ORDER_RATE_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
        return NextResponse.json(
            {error: 'Too many order requests. Try again later.'},
            {
                status: 429,
                headers: {'Retry-After': String(rateLimit.retryAfterSeconds)},
            },
        );
    }

    let payload: unknown;

    try {
        payload = await readJsonBody(request, MAX_BODY_BYTES);
    } catch (error) {
        const bodyError = error instanceof RequestBodyError
            ? error
            : new RequestBodyError('Invalid JSON body', 400);

        return NextResponse.json(
            {error: bodyError.message},
            {status: bodyError.status},
        );
    }

    const validation = parseCreateOrderInput(payload);

    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                fieldErrors: validation.fieldErrors,
            },
            {status: 422},
        );
    }

    try {
        const order = await createOrder(validation.data);

        after(async () => {
            try {
                await sendTelegramMessage(formatOrderTelegramMessage(order));
            } catch (error) {
                console.error('Failed to send Telegram order notification', error);
            }
        });

        return NextResponse.json(
            {ok: true},
            {status: 201},
        );
    } catch (error) {
        if (error instanceof ProductNotFoundError) {
            return NextResponse.json(
                {
                    error: 'Product not found',
                    fieldErrors: {
                        productId: ['Избраният продукт не съществува'],
                    },
                },
                {status: 404},
            );
        }

        console.error('Failed to create order', error);

        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500},
        );
    }

}
