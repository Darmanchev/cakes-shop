import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const order = await request.json();

  if (!order.name || !order.contact || !order.productId || !order.date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Здесь серверная часть Next.js.
  // Сейчас мы просто выводим заказ в терминал, а позже отсюда отправим сообщение в Telegram Bot API.
  console.log('New cake shop order:', order);

  return NextResponse.json({ ok: true });
}
