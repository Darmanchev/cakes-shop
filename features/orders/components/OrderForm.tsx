'use client';

import {FormEvent, useState} from 'react';
import Script from 'next/script';
import {Send} from 'lucide-react';
import {useLanguage} from '@/components/language/LanguageProvider';
import type {Product} from '@/features/products/product.types';
import type {OrderApiErrorResponse, OrderFieldErrors, OrderFormStatus} from '../order.types';

function getTodayInSofia() {
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Sofia',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(new Date());

    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;

    return `${year}-${month}-${day}`;
}

function getMaxOrderDate(minDate: string) {
    const date = new Date(`${minDate}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + 365);

    return date.toISOString().slice(0, 10);
}

function FieldError({messages}: { messages?: string[] }) {
    const message = messages?.[0];

    if (!message) {
        return null;
    }

    return (
        <p className="text-sm text-red-700" role="alert">{message}</p>
    );
}

export function OrderForm({
    products,
    turnstileSiteKey,
}: {
    products: Product[];
    turnstileSiteKey?: string;
}) {
    const [status, setStatus] = useState<OrderFormStatus>('idle');
    const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>({});
    const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
    const {t} = useLanguage();
    const minOrderDate = getTodayInSofia();
    const maxOrderDate = getMaxOrderDate(minOrderDate);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('sending');
        setFieldErrors({});

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const responseBody = await response.json().catch(() => null) as OrderApiErrorResponse | null;

                setFieldErrors(responseBody?.fieldErrors ?? {});
                setStatus('error');
                window.turnstile?.reset();

                return;
            }

            setStatus('success');
            form.reset();
            setDeliveryType('DELIVERY');
            window.turnstile?.reset();
        } catch (error) {
            console.error('Failed to submit order', error);
            setStatus('error');
        }
    }

    const hasFieldErrors = Object.values(fieldErrors).some(
        (messages) => messages?.length,
    );

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
            {turnstileSiteKey ? (
                <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    strategy="afterInteractive"
                />
            ) : null}
            <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-stone-800">
                    {t.form.name}
                </label>
                <input id="name" name="name" maxLength={100} required
                       className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"/>
                <FieldError messages={fieldErrors.name}/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium text-stone-800">
                    {t.form.phone}
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={32}
                    required
                    placeholder="+359..."
                    className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"/>
                <FieldError messages={fieldErrors.phone}/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-stone-800">
                    {t.form.email}
                </label>

                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"
                />
                <FieldError messages={fieldErrors.email}/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="productId" className="text-sm font-medium text-stone-800">
                    {t.form.product}
                </label>
                <select id="productId" name="productId" required
                        className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700">
                    <option value="">{t.form.productPlaceholder}</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {t.products[product.id]?.name ?? product.name}
                        </option>
                    ))}
                </select>
                <FieldError messages={fieldErrors.productId}/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="quantity" className="text-sm font-medium text-stone-800">
                    {t.form.quantity}
                </label>

                <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={20}
                    defaultValue={1}
                    required
                    className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"
                />
                <FieldError messages={fieldErrors.quantity}/>
            </div>

            <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium text-stone-800">
                    {t.form.date}
                </label>
                <input id="date" name="date" type="date" min={minOrderDate} max={maxOrderDate} required
                       className="h-11 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"/>
                <FieldError messages={fieldErrors.date}/>
            </div>

            <fieldset className="grid gap-2">
                <legend className="text-sm font-medium text-stone-800">
                    {t.form.deliveryType}
                </legend>
                <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2">
                        <input
                            type="radio"
                            name="deliveryType"
                            value="DELIVERY"
                            checked={deliveryType === 'DELIVERY'}
                            onChange={() => setDeliveryType('DELIVERY')}
                        />
                        {t.form.delivery}
                    </label>
                    <label className="inline-flex items-center gap-2">
                        <input
                            type="radio"
                            name="deliveryType"
                            value="PICKUP"
                            checked={deliveryType === 'PICKUP'}
                            onChange={() => setDeliveryType('PICKUP')}
                        />
                        {t.form.pickup}
                    </label>
                </div>
                <FieldError messages={fieldErrors.deliveryType}/>
            </fieldset>

            {deliveryType === 'DELIVERY' ? <div className="grid gap-2">
                <label htmlFor="deliveryAddress" className="text-sm font-medium text-stone-800">
                    {t.form.deliveryAddress}
                </label>

                <textarea
                    id="deliveryAddress"
                    name="deliveryAddress"
                    rows={3}
                    required
                    maxLength={300}
                    autoComplete="street-address"
                    className="resize-none rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-rose-700"
                />
                <FieldError messages={fieldErrors.deliveryAddress}/>
            </div> : <input type="hidden" name="deliveryAddress" value=""/>}

            <div className="grid gap-2">
                <label htmlFor="comment" className="text-sm font-medium text-stone-800">
                    {t.form.comment}
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    maxLength={500}
                    className="resize-none rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-rose-700"
                />
                <FieldError messages={fieldErrors.comment}/>
            </div>

            {turnstileSiteKey ? (
                <div
                    className="cf-turnstile"
                    data-sitekey={turnstileSiteKey}
                    data-action="create-order"
                    data-response-field-name="turnstileToken"
                />
            ) : null}

            <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                <Send size={17} aria-hidden="true"/>
                {status === 'sending' ? t.form.sending : t.form.submit}
            </button>

            {status === 'success' ? <p className="text-sm text-emerald-700">{t.form.success}</p> : null}
            {status === 'error' && !hasFieldErrors ? (
                <p className="text-sm text-red-700" role="alert">{t.form.error}</p>
            ) : null}

        </form>
    );
}
