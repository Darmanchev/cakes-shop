import type {getOrders} from '../order.service';
import {updateOrderStatusAction} from '../order.admin.actions';

type Orders = Awaited<ReturnType<typeof getOrders>>;

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
            <div className="max-h-[calc(100vh-180px)] overflow-auto">
                <table className="min-w-[1600px] border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-stone-100 text-stone-700 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 font-medium">Клиент</th>
                        <th className="px-4 py-3 font-medium">Телефон</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Товар</th>
                        <th className="px-4 py-3 font-medium">Количество</th>
                        <th className="px-4 py-3 font-medium">Дата заказа</th>
                        <th className="px-4 py-3 font-medium">Адрес за доставка</th>
                        <th className="px-4 py-3 font-medium">Статус</th>
                        <th className="px-4 py-3 font-medium">Создан</th>
                        <th className="px-4 py-3 font-medium">Комментарий</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-4 py-3 font-medium text-stone-950">{order.name}</td>
                            <td className="px-4 py-3 text-stone-700">{order.phone}</td>
                            <td className="px-4 py-3 text-stone-700">{order.email || '-'}</td>
                            <td className="px-4 py-3 text-stone-700">{order.product.name}</td>
                            <td className="px-4 py-3 text-stone-700">{order.quantity}</td>
                            <td className="px-4 py-3 text-stone-700">{formatDate(order.date)}</td>
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}