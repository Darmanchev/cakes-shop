import {after, NextResponse} from 'next/server';
import {parseCreateOrderInput} from '@/features/orders/order.schema';
import {createOrder, ProductNotFoundError} from '@/features/orders/order.service';
import {formatOrderTelegramMessage, sendTelegramMessage} from '@/features/orders/order.notifications';
import {RequestBodyError, readJsonBody} from '@/lib/http/read-json-body';
import {consumeRateLimit, getClientIdentifier} from '@/lib/security/rate-limit';
import {getClientIp} from '@/lib/security/client-ip';
import {verifyTurnstileToken} from '@/lib/security/turnstile';

const MAX_BODY_BYTES = 16 * 1024;
const ORDER_RATE_LIMIT = 5;
const ORDER_REQUEST_RATE_LIMIT = 30;
const ORDER_RATE_WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
    const clientIdentifier = getClientIdentifier(request.headers);
    const clientIp = getClientIp(request.headers);

    if (!clientIdentifier) {
        console.error('Trusted proxy did not provide a valid client IP');
        return NextResponse.json({error: 'Service unavailable'}, {status: 503});
    }

    const requestRateLimit = await consumeRateLimit({
        scope: 'create-order-request',
        identifier: clientIdentifier,
        limit: ORDER_REQUEST_RATE_LIMIT,
        windowMs: ORDER_RATE_WINDOW_MS,
    });

    if (!requestRateLimit.allowed) {
        return NextResponse.json(
            {error: 'Too many requests. Try again later.'},
            {
                status: 429,
                headers: {'Retry-After': String(requestRateLimit.retryAfterSeconds)},
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

    const turnstileToken = payload && typeof payload === 'object' && !Array.isArray(payload)
        ? (payload as Record<string, unknown>).turnstileToken
        : undefined;
    const orderPayload = payload && typeof payload === 'object' && !Array.isArray(payload)
        ? Object.fromEntries(
            Object.entries(payload as Record<string, unknown>)
                .filter(([key]) => key !== 'turnstileToken'),
        )
        : payload;
    const validation = parseCreateOrderInput(orderPayload);

    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                fieldErrors: validation.fieldErrors,
            },
            {status: 422},
        );
    }

    if (!await verifyTurnstileToken(turnstileToken, 'create-order', clientIp)) {
        return NextResponse.json(
            {error: 'Bot verification failed. Try again.'},
            {status: 422},
        );
    }

    const rateLimit = await consumeRateLimit({
        scope: 'create-order',
        identifier: clientIdentifier,
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
