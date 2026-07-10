import type { getOrders } from '../order.service'

type Orders = Awaited<ReturnType<typeof getOrders>>;

const statusLabels = {
    NEW: 'Новый',
    CONFIRMED: 'Подтверджен',
    COMPLETED: 'Выполнен',
    CANCELED: 'Отменен',
} as const;

function formatDate(date: Date) {
    return new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
}

export function OrdersTable({ orders }: { orders: Orders }) {
    if (orders.length === 0 ) {
        return (
            <div className="rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600">
                Заказов пока нет.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                    <thead className="bg-stone-100 text-stone-700">
                    <tr>
                        <th className="px-4 py-3 font-medium">Клиент</th>
                        <th className="px-4 py-3 font-medium">Телефон</th>
                        <th className="px-4 py-3 font-medium">Товар</th>
                        <th className="px-4 py-3 font-medium">Дата заказа</th>
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
                            <td className="px-4 py-3 text-stone-700">{order.product.name}</td>
                            <td className="px-4 py-3 text-stone-700">{formatDate(order.date)}</td>
                            <td className="px-4 py-3 text-stone-700">{statusLabels[order.status]}</td>
                            <td className="px-4 py-3 text-stone-700">{formatDate(order.createdAt)}</td>
                            <td className="px-4 py-3 text-stone-700">{order.comment || '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}