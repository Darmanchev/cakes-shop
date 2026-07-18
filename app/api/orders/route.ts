import {NextResponse} from 'next/server';
import {parseCreateOrderInput} from '@/features/orders/order.schema';
import {createOrder} from '@/features/orders/order.service';

export async function POST(request: Request) {
    let payload: unknown;

    try {
        payload = await request.json();
    } catch {
        return NextResponse.json(
            {error: 'Invalid JSON body'},
            {status: 400},
        );
    }

    const order = parseCreateOrderInput(payload);

    if (!order) {
        return NextResponse.json(
            {error: 'Missing or invalid fields'},
            {status: 400},
        );
    }

    await createOrder(order);

    return NextResponse.json({ok: true});
}