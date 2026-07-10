import { NextResponse } from 'next/server';
import { parseCreateOrderInput } from '@/features/orders/order.schema';
import { createOrder } from '@/features/orders/order.service';

export async function POST(request: Request) {
  const payload = await request.json();
  const order = parseCreateOrderInput(payload);

  if (!order) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await createOrder(order);

  return NextResponse.json({ ok: true });
}
