import Link from 'next/link';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import { getOrders } from '@/features/orders/order.service';

export default async function AdminOrdersPage() {
    const orders = await getOrders();

    return (
        <main className="min-h-screen bg-[#fff8f2] px-4 py-8 text-stone-950 sm:px-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-stone-600">Админ-панель</p>
                        <h1 className="mt-1 text-3xl font-bold">Заказы</h1>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium hover:border-stone-950"
                    >
                        На сайт
                    </Link>
                </div>

                <OrdersTable orders={orders} />
            </div>
        </main>
    );
}