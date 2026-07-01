'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import type { Product } from '@/data/products';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

export function OrderForm({ products }: { products: Product[] }) {
  const [status, setStatus] = useState<FormStatus>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');

    // FormData удобно забирает значения из полей по их name.
    // Так форма остается обычной HTML-формой, но мы отправляем ее через fetch без перезагрузки страницы.
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setStatus(response.ok ? 'success' : 'error');

    if (response.ok) {
      event.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-stone-800">
          Имя
        </label>
        <input id="name" name="name" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact" className="text-sm font-medium text-stone-800">
          Телефон или Telegram
        </label>
        <input id="contact" name="contact" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="productId" className="text-sm font-medium text-stone-800">
          Что хотите заказать
        </label>
        <select id="productId" name="productId" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700">
          <option value="">Выберите товар</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm font-medium text-stone-800">
          Дата, к которой нужен заказ
        </label>
        <input id="date" name="date" type="date" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="comment" className="text-sm font-medium text-stone-800">
          Комментарий
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          className="resize-none rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-rose-700"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={17} aria-hidden="true" />
        {status === 'sending' ? 'Отправляем...' : 'Отправить заявку'}
      </button>

      {status === 'success' ? <p className="text-sm text-emerald-700">Заявка отправлена. Следующий шаг: подключить Telegram.</p> : null}
      {status === 'error' ? <p className="text-sm text-red-700">Не получилось отправить заявку. Проверьте сервер и попробуйте еще раз.</p> : null}
    </form>
  );
}
