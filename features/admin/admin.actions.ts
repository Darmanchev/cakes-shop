'use server';

import {cookies, headers} from 'next/headers';
import { redirect } from 'next/navigation';
import {
    ADMIN_SESSION_COOKIE,
    ADMIN_SESSION_MAX_AGE_SECONDS,
    authenticateAdmin,
    revokeAdminSession,
    revokeAllAdminSessions,
} from "./admin.auth";
import {clearRateLimit, consumeRateLimit, getClientIdentifier} from '@/lib/security/rate-limit';

const LOGIN_RATE_LIMIT_SCOPE = 'admin-login';
const LOGIN_RATE_LIMIT = 5;
const LOGIN_RATE_WINDOW_MS = 15 * 60 * 1000;

export interface AdminLoginState {
    error: string | null;
}

export async function loginAdmin(
    _previousState: AdminLoginState,
    formData: FormData,
): Promise<AdminLoginState> {
    const password = formData.get('password');
    const totp = formData.get('totp');
    const requestHeaders = await headers();
    const clientIdentifier = getClientIdentifier(requestHeaders);

    if (!clientIdentifier) {
        console.error('Trusted proxy did not provide a valid client IP');
        return {
            error: 'Вход временно недоступен',
        };
    }

    const rateLimit = await consumeRateLimit({
        scope: LOGIN_RATE_LIMIT_SCOPE,
        identifier: clientIdentifier,
        limit: LOGIN_RATE_LIMIT,
        windowMs: LOGIN_RATE_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
        return {
            error: `Твърде много опити. Опитайте след ${rateLimit.retryAfterSeconds} сек.`,
        };
    }

    if (typeof password !== 'string' || typeof totp !== 'string' || password.length > 256) {
        return {
            error: 'Грешна парола',
        };
    }

    const sessionToken = await authenticateAdmin(password, totp, clientIdentifier);

    if (!sessionToken) {
        return {error: 'Грешна парола или код'};
    }

    await clearRateLimit(LOGIN_RATE_LIMIT_SCOPE, clientIdentifier);
    const cookieStore = await cookies();

    cookieStore.set(
        ADMIN_SESSION_COOKIE,
        sessionToken,
        {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
        },
    );

    redirect('/admin/orders');
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

    await revokeAdminSession(sessionToken);

    cookieStore.delete(ADMIN_SESSION_COOKIE);

    redirect('/admin/login');
}

export async function logoutAllAdminSessions() {
    await revokeAllAdminSessions();

    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);

    redirect('/admin/login');
}
