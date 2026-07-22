import 'server-only';

import {
    createHash,
    createHmac,
    randomBytes,
    scryptSync,
    timingSafeEqual,
} from 'node:crypto';
import {prisma} from '@/lib/prisma';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;

function getRequiredEnv(name: 'ADMIN_PASSWORD_HASH' | 'ADMIN_TOTP_SECRET') {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is not configured`);
    }

    return value;
}

function safeCompare(left: Buffer | string, right: Buffer | string) {
    const leftBuffer = Buffer.isBuffer(left) ? left : Buffer.from(left);
    const rightBuffer = Buffer.isBuffer(right) ? right : Buffer.from(right);

    return leftBuffer.length === rightBuffer.length
        && timingSafeEqual(leftBuffer, rightBuffer);
}

function hashSessionToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}

function decodeBase32(value: string) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const normalized = value.toUpperCase().replaceAll(' ', '').replace(/=+$/, '');
    let bits = '';

    for (const character of normalized) {
        const index = alphabet.indexOf(character);

        if (index < 0) {
            throw new Error('ADMIN_TOTP_SECRET is not valid base32');
        }

        bits += index.toString(2).padStart(5, '0');
    }

    const bytes: number[] = [];

    for (let index = 0; index + 8 <= bits.length; index += 8) {
        bytes.push(Number.parseInt(bits.slice(index, index + 8), 2));
    }

    const decoded = Buffer.from(bytes);

    if (decoded.length < 16) {
        throw new Error('ADMIN_TOTP_SECRET must contain at least 128 bits');
    }

    return decoded;
}

function createTotp(secret: Buffer, counter: number) {
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));

    const digest = createHmac('sha1', secret).update(counterBuffer).digest();
    const offset = digest[digest.length - 1] & 0x0f;
    const binary = (digest.readUInt32BE(offset) & 0x7fffffff) % (10 ** TOTP_DIGITS);

    return binary.toString().padStart(TOTP_DIGITS, '0');
}

export function verifyAdminPassword(password: string) {
    const [algorithm, saltEncoded, hashEncoded, extra] = getRequiredEnv('ADMIN_PASSWORD_HASH').split('$');

    if (algorithm !== 'scrypt' || !saltEncoded || !hashEncoded || extra) {
        throw new Error('ADMIN_PASSWORD_HASH has an invalid format');
    }

    const salt = Buffer.from(saltEncoded, 'base64url');
    const expectedHash = Buffer.from(hashEncoded, 'base64url');

    if (salt.length < 16 || expectedHash.length < 32) {
        throw new Error('ADMIN_PASSWORD_HASH has an invalid format');
    }

    const actualHash = scryptSync(password, salt, expectedHash.length);

    return safeCompare(actualHash, expectedHash);
}

export function verifyAdminTotp(code: string, now = Date.now()) {
    if (!/^\d{6}$/.test(code)) {
        return false;
    }

    const secret = decodeBase32(getRequiredEnv('ADMIN_TOTP_SECRET'));
    const counter = Math.floor(now / 1000 / TOTP_PERIOD_SECONDS);

    return [-1, 0, 1].some((offset) => (
        safeCompare(code, createTotp(secret, counter + offset))
    ));
}

export async function createAdminSession() {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000);

    await prisma.$transaction([
        prisma.adminSession.deleteMany({where: {expiresAt: {lte: new Date()}}}),
        prisma.adminSession.create({
            data: {
                tokenHash: hashSessionToken(token),
                expiresAt,
            },
        }),
    ]);

    return token;
}

export async function verifyAdminSessionToken(token: string | undefined) {
    if (!token || token.length > 128) {
        return false;
    }

    const tokenHash = hashSessionToken(token);
    const session = await prisma.adminSession.findUnique({where: {tokenHash}});

    if (!session) {
        return false;
    }

    if (session.expiresAt <= new Date()) {
        await prisma.adminSession.delete({where: {tokenHash}}).catch(() => undefined);
        return false;
    }

    return true;
}

export async function revokeAdminSession(token: string | undefined) {
    if (!token || token.length > 128) {
        return;
    }

    await prisma.adminSession.deleteMany({
        where: {tokenHash: hashSessionToken(token)},
    });
}
