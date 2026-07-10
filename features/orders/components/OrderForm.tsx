'use client';

import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '@/components/language/LanguageProvider';
import type { Product } from '@/features/products/product.types';
import type { OrderFormStatus } from '../order.types';

export function OrderForm({ products }: { products: Product[] }) {
  const [status, setStatus] = useState<OrderFormStatus>('idle');
  const { t } = useLanguage();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setStatus('sending');

      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      const response = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
      });

      setStatus(response.ok ? 'success' : 'error');

      if (response.ok) {
          form.reset();
      }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium text-stone-800">
          {t.form.name}
        </label>
        <input id="name" name="name" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="phone" className="text-sm font-medium text-stone-800">
          {t.form.phone}
        </label>
        <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="+359..."
            className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="productId" className="text-sm font-medium text-stone-800">
          {t.form.product}
        </label>
        <select id="productId" name="productId" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700">
          <option value="">{t.form.productPlaceholder}</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {t.products[product.id]?.name ?? product.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="date" className="text-sm font-medium text-stone-800">
          {t.form.date}
        </label>
        <input id="date" name="date" type="date" required className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="comment" className="text-sm font-medium text-stone-800">
          {t.form.comment}
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
        {status === 'sending' ? t.form.sending : t.form.submit}
      </button>

      {status === 'success' ? <p className="text-sm text-emerald-700">{t.form.success}</p> : null}
      {status === 'error' ? <p className="text-sm text-red-700">{t.form.error}</p> : null}
    </form>
  );
}
