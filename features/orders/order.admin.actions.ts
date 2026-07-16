'use server';

import { OrderStatus } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/features/admin/admin.auth';
import { updateOrderStatus } from './order.service';

const allowedStatuses = new Set<string>(Object.values(OrderStatus));

export async function updateOrderStatusAction(formData: FormData) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    if (!verifyAdminSessionToken(sessionToken)) {
        redirect('/admin/login');
    }

    const orderId = formData.get('orderId');
    const status = formData.get('status');

    if (typeof orderId !== 'string' || orderId.length === 0 ||
        typeof status !== 'string' || !allowedStatuses.has(status)
    ) {
        throw new Error('Invalid order status payload');
    }

    await updateOrderStatus(orderId,status as OrderStatus);

    revalidatePath('/admin/orders');
}