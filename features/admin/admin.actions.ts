'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ADMIN_SESSION_COOKIE,
    createAdminSessionToken,
    verifyAdminPassword,
} from "./admin.auth";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface AdminLoginState {
    error: string | null;
}

export async function loginAdmin(
    _previousState: AdminLoginState,
    formData: FormData,
): Promise<AdminLoginState> {
    const password = formData.get('password');

    if (
        typeof password !== 'string' ||
        !verifyAdminPassword(password)
    ) {
        return {
            error: 'Грешна парола',
        };
    }

    const cookieStore = await cookies();

    cookieStore.set(
        ADMIN_SESSION_COOKIE,
        createAdminSessionToken(),
        {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: SESSION_MAX_AGE_SECONDS,
        },
    );

    redirect('/admin/orders');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();

    cookieStore.delete(ADMIN_SESSION_COOKIE);

    redirect('/admin/login');
}