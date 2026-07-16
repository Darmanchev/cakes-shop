import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ADMIN_SESSION_COOKIE,
    verifyAdminSessionToken,
} from '@/features/admin/admin.auth';
import { logoutAdmin } from '@/features/admin/admin.actions';
import { OrdersTable } from '@/features/orders/components/OrdersTable';
import { getOrders } from '@/features/orders/order.service';

export default async function AdminOrdersPage() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(
        ADMIN_SESSION_COOKIE,
    )?.value;

    if (!verifyAdminSessionToken(sessionToken)) {
        redirect('/admin/login');
    }

    const orders = await getOrders();

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
                    </div>
                </div>

                <OrdersTable orders={orders} />
            </div>
        </main>
    );
}