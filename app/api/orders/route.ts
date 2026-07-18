import {NextResponse} from 'next/server';
import {parseCreateOrderInput} from '@/features/orders/order.schema';
import {createOrder, ProductNotFoundError} from '@/features/orders/order.service';

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
        await createOrder(validation.data);

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