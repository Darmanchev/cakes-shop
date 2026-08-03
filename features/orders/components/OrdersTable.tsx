import type {getOrders} from '../order.service';
import {updateOrderStatusAction} from '../order.admin.actions';
import { formatPrice } from '@/lib/utils/format-price';

type Orders = Awaited<ReturnType<typeof getOrders>>['items'];

const statusLabels = {
    NEW: 'New',
    CONFIRMED: 'Confirmed',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
} as const;

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

export function OrdersTable({orders}: { orders: Orders }) {
    if (orders.length === 0) {
        return (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600">
                Заказов пока нет.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-stone-200 bg-white">
            <div className="grid divide-y divide-stone-200 md:hidden">
                {orders.map((order) => {
                    const items = order.items.length > 0
                        ? order.items
                        : [{
                            id: order.id,
                            productName: order.productName,
                            unitPriceMinor: order.unitPriceMinor,
                            quantity: order.quantity,
                            totalMinor: order.totalMinor,
                            comment: null,
                        }];

                    return (
                        <article key={order.id} className="grid gap-4 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <h2 className="font-semibold text-stone-950">{order.name}</h2>
                                    <a href={`tel:${order.phone}`} className="mt-1 block break-all text-sm text-rose-700">
                                        {order.phone}
                                    </a>
                                    {order.email ? (
                                        <a href={`mailto:${order.email}`} className="mt-1 block break-all text-sm text-stone-600">
                                            {order.email}
                                        </a>
                                    ) : null}
                                </div>
                                <p className="shrink-0 text-sm font-semibold text-stone-950">
                                    {formatPrice(order.totalMinor, 'ru')}
                                </p>
                            </div>

                            <div className="grid gap-2 rounded-md bg-stone-50 p-3 text-sm">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-medium text-stone-800">{item.productName} × {item.quantity}</p>
                                            {item.comment ? <p className="mt-1 text-xs text-stone-500">{item.comment}</p> : null}
                                        </div>
                                        <p className="shrink-0 text-stone-700">{formatPrice(item.unitPriceMinor, 'ru')}</p>
                                    </div>
                                ))}
                            </div>

                            <dl className="grid gap-2 text-sm text-stone-700">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500">Дата заказа</dt>
                                    <dd className="text-right">{formatDate(order.date)}</dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-stone-500">Получение</dt>
                                    <dd className="text-right">{order.deliveryType === 'DELIVERY' ? 'Доставка' : 'Самовывоз'}</dd>
                                </div>
                                {order.deliveryAddress ? (
                                    <div>
                                        <dt className="text-stone-500">Адрес</dt>
                                        <dd className="mt-1 break-words">{order.deliveryAddress}</dd>
                                    </div>
                                ) : null}
                                {order.comment ? (
                                    <div>
                                        <dt className="text-stone-500">Комментарий</dt>
                                        <dd className="mt-1 break-words">{order.comment}</dd>
                                    </div>
                                ) : null}
                            </dl>

                            <form action={updateOrderStatusAction} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                                <input type="hidden" name="orderId" value={order.id}/>
                                <select name="status" defaultValue={order.status} aria-label={`Статус заказа ${order.id}`} className="h-10 min-w-0 rounded-md border border-stone-300 bg-white px-2 outline-none focus:border-rose-700">
                                    {Object.entries(statusLabels).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                <button type="submit" className="h-10 rounded-md bg-stone-950 px-3 text-xs font-medium text-white hover:bg-stone-800">
                                    Сохранить
                                </button>
                            </form>
                        </article>
                    );
                })}
            </div>

            <div className="hidden max-h-[calc(100vh-180px)] overflow-auto md:block">
                <table className="min-w-[1800px] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-stone-100 text-stone-700 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 font-medium">Клиент</th>
                        <th className="px-4 py-3 font-medium">Телефон</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Товар</th>
                        <th className="px-4 py-3 font-medium">Цена</th>
                        <th className="px-4 py-3 font-medium">Количество</th>
                        <th className="px-4 py-3 font-medium">Итого</th>
                        <th className="px-4 py-3 font-medium">Дата заказа</th>
                        <th className="px-4 py-3 font-medium">Получение</th>
                        <th className="px-4 py-3 font-medium">Адрес доставки</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                        <th className="px-4 py-3 font-medium">Создан</th>
                        <th className="px-4 py-3 font-medium">Комментарий</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                    {orders.map((order) => {
                        const items = order.items.length > 0
                            ? order.items
                            : [{
                                id: order.id,
                                productName: order.productName,
                                unitPriceMinor: order.unitPriceMinor,
                                quantity: order.quantity,
                                totalMinor: order.totalMinor,
                                comment: null,
                            }];

                        return <tr key={order.id}>
                            <td className="px-4 py-3 font-medium text-stone-950">{order.name}</td>
                            <td className="px-4 py-3 text-stone-700">{order.phone}</td>
                            <td className="px-4 py-3 text-stone-700">{order.email || '-'}</td>
                            <td className="px-4 py-3 text-stone-700">
                                <div className="grid gap-2">
                                    {items.map((item) => <div key={item.id}>
                                        <p>{item.productName}</p>
                                        {item.comment ? <p className="mt-1 text-xs text-stone-500">{item.comment}</p> : null}
                                    </div>)}
                                </div>
                            </td>
                            <td className="px-4 py-3 text-stone-700">
                                <div className="grid gap-2">{items.map((item) => <p key={item.id}>{formatPrice(item.unitPriceMinor, 'ru')}</p>)}</div>
                            </td>
                            <td className="px-4 py-3 text-stone-700">
                                <div className="grid gap-2">{items.map((item) => <p key={item.id}>{item.quantity}</p>)}</div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-950">{formatPrice(order.totalMinor, 'ru')}</td>
                            <td className="px-4 py-3 text-stone-700">{formatDate(order.date)}</td>
                            <td className="px-4 py-3 text-stone-700">
                                {order.deliveryType === 'DELIVERY' ? 'Доставка' : 'Самовывоз'}
                            </td>
                            <td className="max-w-xs whitespace-normal px-4 py-3 text-stone-700">{order.deliveryAddress || '—'}</td>
                            <td className="px-4 py-3 text-stone-700">
                                <form action={updateOrderStatusAction} className="flex min-w-64 items-center gap-2">
                                    <input type="hidden" name="orderId" value={order.id}/>

                                    <select name="status" defaultValue={order.status} aria-label={`Статус заказа ${order.id}`} className="h-9 rounded-md border border-stone-300 bg-white px-2 outline-none focus:border-rose-700">
                                        {Object.entries(statusLabels).map(
                                            ([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ),
                                        )}
                                    </select>

                                    <button type="submit" className="h-9 rounded-md bg-stone-950 px-3 text-xs font-medium text-white hover:bg-stone-800">
                                        Сохранить
                                    </button>
                                </form>
                            </td>
                            <td className="px-4 py-3 text-stone-700">{formatDate(order.createdAt)}</td>
                            <td className="px-4 py-3 text-stone-700">{order.comment || '—'}</td>
                        </tr>;
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
