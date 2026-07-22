import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ADMIN_SESSION_COOKIE,
    verifyAdminSessionToken,
    getAdminSecuritySummary,
} from '@/features/admin/admin.auth';
import {logoutAdmin, logoutAllAdminSessions} from '@/features/admin/admin.actions';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import { getOrders } from '@/features/orders/order.service';

interface AdminOrdersPageProps {
    searchParams: Promise<{page?: string}>;
}

export default async function AdminOrdersPage({searchParams}: AdminOrdersPageProps) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(
        ADMIN_SESSION_COOKIE,
    )?.value;

    if (!await verifyAdminSessionToken(sessionToken)) {
        redirect('/admin/login');
    }

    const params = await searchParams;
    const requestedPage = Number.parseInt(params.page ?? '1', 10);
    const page = Number.isFinite(requestedPage)
        ? Math.min(1_000_000, Math.max(1, requestedPage))
        : 1;
    const [orders, security] = await Promise.all([
        getOrders(page),
        getAdminSecuritySummary(),
    ]);

    return (
        <main className="min-h-screen bg-[#fff8f2] px-4 py-8 text-stone-950 sm:px-6">
            <div className="mx-auto w-full max-w-none">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="text-sm text-stone-600">
                            Админ-панель
                        </p>

                        <h1 className="mt-1 text-3xl font-bold">
                            Заказы
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="inline-flex h-11 items-center justify-center rounded-md border border-stone-300 bg-white px-4 text-sm font-medium hover:border-stone-950"
                        >
                            На сайт
                        </Link>

                        <form action={logoutAdmin}>
                            <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center rounded-md bg-stone-950 px-4 text-sm font-medium text-white hover:bg-stone-800"
                            >
                                Выйти
                            </button>
                        </form>
                        <form action={logoutAllAdminSessions}>
                            <button
                                type="submit"
                                className="inline-flex h-11 items-center justify-center rounded-md border border-red-300 bg-white px-4 text-sm font-medium text-red-800 hover:bg-red-50"
                            >
                                Завершить все сессии ({security.activeSessions})
                            </button>
                        </form>
                    </div>
                </div>

                <OrdersTable orders={orders.items} />

                <section className="mt-6 rounded-lg border border-stone-200 bg-white p-5">
                    <h2 className="text-lg font-semibold">Журнал входов</h2>
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead><tr className="text-stone-600"><th className="py-2">Время</th><th>Результат</th><th>Клиент (hash)</th></tr></thead>
                            <tbody className="divide-y divide-stone-100">
                            {security.loginEvents.map((event) => (
                                <tr key={event.id}>
                                    <td className="py-2">{event.createdAt.toLocaleString('ru-RU')}</td>
                                    <td>{event.outcome}</td>
                                    <td className="font-mono">{event.identifierHash}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {orders.pageCount > 1 ? (
                    <nav className="mt-4 flex items-center justify-between" aria-label="Страницы заказов">
                        <Link
                            href={`/admin/orders?page=${Math.max(1, orders.page - 1)}`}
                            aria-disabled={orders.page <= 1}
                            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        >
                            Назад
                        </Link>
                        <span className="text-sm text-stone-600">
                            Страница {orders.page} от {orders.pageCount} · {orders.total} заказа
                        </span>
                        <Link
                            href={`/admin/orders?page=${Math.min(orders.pageCount, orders.page + 1)}`}
                            aria-disabled={orders.page >= orders.pageCount}
                            className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
                        >
                            Напред
                        </Link>
                    </nav>
                ) : null}
            </div>
        </main>
    );
}
