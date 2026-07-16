import 'server-only';
import {createHmac, timingSafeEqual} from "node:crypto";

export const ADMIN_SESSION_COOKIE = 'admin_session';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

interface AdminSessionPayload {
    role: 'admin';
    exp: number;
}

function getRequiredEnv(name: 'ADMIN_PASSWORD' | 'ADMIN_SESSION_SECRET') {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not configured`);
    }

    return value;
}

function safeCompare(left: string, right: string) {
    const leftBuffer = Buffer.from(left);
    const rightBuffer = Buffer.from(right);

    if (leftBuffer.length !== rightBuffer.length) {
        return false;
    }

    return timingSafeEqual(leftBuffer, rightBuffer);
}

function sign(value: string) {
    return createHmac('sha256', getRequiredEnv('ADMIN_SESSION_SECRET'),)
        .update(value)
        .digest('base64url');
}

export function verifyAdminPassword(password: string) {
    return safeCompare(password, getRequiredEnv('ADMIN_PASSWORD'),);
}

export function createAdminSessionToken() {
    const payload: AdminSessionPayload = {
        role: 'admin',
        exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
    };

    const encodedPayload = Buffer.from(JSON.stringify(payload),).toString('base64url');

    return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifyAdminSessionToken(token: string | undefined) {
    if (!token) {
        return false;
    }

    const parts = token.split('.');

    if (parts.length !== 2) {
        return false;
    }

    const [encodedPayload, receivedSignature] = parts;
    const expectedSignature = sign(encodedPayload);

    if (!safeCompare(receivedSignature, expectedSignature)) {
        return false;
    }

    try {
        const payload = JSON.parse(
            Buffer.from(encodedPayload, 'base64url').toString('utf-8'),
        ) as Partial<AdminSessionPayload>;

        return (
            payload.role === 'admin' &&
            typeof payload.exp === 'number' &&
            payload.exp > Math.floor(Date.now() / 1000)
        );
    } catch {
        return false;
    }


}
