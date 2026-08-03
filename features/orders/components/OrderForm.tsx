'use client';

import {FormEvent, useState} from 'react';
import {Plus, Send, Trash2} from 'lucide-react';
import {useLanguage} from '@/components/language/LanguageProvider';
import type {Product} from '@/features/products/product.types';
import type {OrderApiErrorResponse, OrderFieldErrors, OrderFormStatus} from '../order.types';

type OrderItemForm = {
    key: number;
    productId: string;
    quantity: number;
    comment: string;
};

let nextItemKey = 1;

function createOrderItem(): OrderItemForm {
    return {key: nextItemKey++, productId: '', quantity: 1, comment: ''};
}

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

function formatDateForTyping(isoDate: string) {
    return isoDate.split('-').reverse().join('.');
}

function getIsoDate(value: string) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const match = /^(\d{2})[./-](\d{2})[./-](\d{4})$/.exec(value);
    return match ? `${match[3]}-${match[2]}-${match[1]}` : '';
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

export function OrderForm({products}: {products: Product[]}) {
    const [status, setStatus] = useState<OrderFormStatus>('idle');
    const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>({});
    const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
    const [items, setItems] = useState<OrderItemForm[]>(() => [createOrderItem()]);
    const [date, setDate] = useState('');
    const {t} = useLanguage();
    const minOrderDate = getTodayInSofia();
    const maxOrderDate = getMaxOrderDate(minOrderDate);

    function updateItem(key: number, update: Partial<Omit<OrderItemForm, 'key'>>) {
        setItems((currentItems) => currentItems.map((item) => (
            item.key === key ? {...item, ...update} : item
        )));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus('sending');
        setFieldErrors({});

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = {
            ...Object.fromEntries(formData.entries()),
            items: items.map(({productId, quantity, comment}) => ({productId, quantity, comment})),
        };

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

                return;
            }

            setStatus('success');
            form.reset();
            setDeliveryType('DELIVERY');
            setItems([createOrderItem()]);
            setDate('');
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

            <fieldset className="grid gap-3">
                <legend className="text-sm font-medium text-stone-800">{t.form.orderItems}</legend>
                {items.map((item, index) => (
                    <div key={item.key} className="grid gap-3 rounded-md border border-stone-200 bg-stone-50 p-3 sm:grid-cols-[minmax(0,1fr)_112px]">
                        <div className="grid gap-2">
                            <label htmlFor={`product-${item.key}`} className="text-sm font-medium text-stone-800">
                                {t.form.product}
                            </label>
                            <select
                                id={`product-${item.key}`}
                                required
                                value={item.productId}
                                onChange={(event) => updateItem(item.key, {productId: event.target.value})}
                                className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none focus:border-rose-700"
                            >
                                <option value="">{t.form.productPlaceholder}</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {t.products[product.id]?.name ?? product.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid gap-2">
                            <label htmlFor={`quantity-${item.key}`} className="text-sm font-medium text-stone-800">
                                {t.form.quantity}
                            </label>
                            <input
                                id={`quantity-${item.key}`}
                                type="number"
                                min={1}
                                max={20}
                                required
                                value={item.quantity}
                                onChange={(event) => updateItem(item.key, {quantity: Number(event.target.value)})}
                                className="h-11 rounded-md border border-stone-300 bg-white px-3 outline-none focus:border-rose-700"
                            />
                        </div>

                        <div className="grid gap-2 sm:col-span-2">
                            <label htmlFor={`item-comment-${item.key}`} className="text-sm font-medium text-stone-800">
                                {t.form.productComment}
                            </label>
                            <div className="flex gap-2">
                                <textarea
                                    id={`item-comment-${item.key}`}
                                    rows={2}
                                    maxLength={500}
                                    value={item.comment}
                                    onChange={(event) => updateItem(item.key, {comment: event.target.value})}
                                    className="min-w-0 flex-1 resize-none rounded-md border border-stone-300 bg-white px-3 py-2 outline-none focus:border-rose-700"
                                />
                                {items.length > 1 ? (
                                    <button
                                        type="button"
                                        onClick={() => setItems((currentItems) => currentItems.filter(({key}) => key !== item.key))}
                                        className="self-end rounded-md border border-stone-300 p-2.5 text-stone-600 hover:border-rose-700 hover:text-rose-700"
                                        aria-label={`${t.form.removeProduct} ${index + 1}`}
                                        title={t.form.removeProduct}
                                    >
                                        <Trash2 size={18} aria-hidden="true"/>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => setItems((currentItems) => [...currentItems, createOrderItem()])}
                        disabled={items.length >= 10}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-stone-300 bg-white px-3 text-sm font-medium text-stone-800 hover:border-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus size={17} aria-hidden="true"/>
                        {t.form.addProduct}
                    </button>
                </div>
                <FieldError messages={fieldErrors.items}/>
            </fieldset>

            <div className="grid gap-2">
                <label htmlFor="date" className="text-sm font-medium text-stone-800">
                    {t.form.date}
                </label>
                <div className="flex gap-2">
                    <input
                        id="date"
                        name="date"
                        type="text"
                        inputMode="numeric"
                        placeholder="ДД.ММ.ГГГГ"
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                        required
                        className="h-11 min-w-0 flex-1 rounded-md border border-stone-300 px-3 outline-none focus:border-rose-700"
                    />
                    <input
                        type="date"
                        value={getIsoDate(date)}
                        min={minOrderDate}
                        max={maxOrderDate}
                        onChange={(event) => setDate(formatDateForTyping(event.target.value))}
                        aria-label={t.form.openCalendar}
                        title={t.form.openCalendar}
                        className="h-11 w-12 rounded-md border border-stone-300 bg-white px-1 text-transparent outline-none focus:border-rose-700"
                    />
                </div>
                <p className="text-sm text-stone-600">{t.form.dateHint}</p>
                <FieldError messages={fieldErrors.date}/>
            </div>

            <fieldset className="grid gap-2">
                <legend className="text-sm font-medium text-stone-800">
                    {t.form.deliveryType}
                </legend>
                <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name="deliveryType" value="DELIVERY" checked={deliveryType === 'DELIVERY'} onChange={() => setDeliveryType('DELIVERY')}/>
                        {t.form.delivery}
                    </label>
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name="deliveryType" value="PICKUP" checked={deliveryType === 'PICKUP'} onChange={() => setDeliveryType('PICKUP')}/>
                        {t.form.pickup}
                    </label>
                </div>
                <FieldError messages={fieldErrors.deliveryType}/>
            </fieldset>

            {deliveryType === 'DELIVERY' ? <div className="grid gap-2">
                <label htmlFor="deliveryAddress" className="text-sm font-medium text-stone-800">{t.form.deliveryAddress}</label>
                <textarea id="deliveryAddress" name="deliveryAddress" rows={3} required maxLength={300} autoComplete="street-address"
                          className="resize-none rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-rose-700"/>
                <FieldError messages={fieldErrors.deliveryAddress}/>
            </div> : <input type="hidden" name="deliveryAddress" value=""/>}

            <div className="grid gap-2">
                <label htmlFor="comment" className="text-sm font-medium text-stone-800">{t.form.comment}</label>
                <textarea id="comment" name="comment" rows={4} maxLength={500}
                          className="resize-none rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-rose-700"/>
                <FieldError messages={fieldErrors.comment}/>
            </div>

            <button type="submit" disabled={status === 'sending'}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-stone-950 px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60">
                <Send size={17} aria-hidden="true"/>
                {status === 'sending' ? t.form.sending : t.form.submit}
            </button>

            {status === 'success' ? <p className="text-sm text-emerald-700">{t.form.success}</p> : null}
            {status === 'error' && !hasFieldErrors ? <p className="text-sm text-red-700" role="alert">{t.form.error}</p> : null}
        </form>
    );
}
