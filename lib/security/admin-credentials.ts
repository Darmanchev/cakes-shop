import {createHmac, scryptSync, timingSafeEqual} from 'node:crypto';

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

export function createAdminTotpForTest(secretBase32: string, counter: number) {
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeBigUInt64BE(BigInt(counter));

    const digest = createHmac('sha1', decodeBase32(secretBase32)).update(counterBuffer).digest();
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

export function getMatchingAdminTotpCounter(code: string, now = Date.now()) {
    if (!/^\d{6}$/.test(code)) {
        return null;
    }

    const secret = getRequiredEnv('ADMIN_TOTP_SECRET');
    const counter = Math.floor(now / 1000 / TOTP_PERIOD_SECONDS);

    for (const offset of [-1, 0, 1]) {
        const candidateCounter = counter + offset;

        if (safeCompare(code, createAdminTotpForTest(secret, candidateCounter))) {
            return candidateCounter;
        }
    }

    return null;
}

export function verifyAdminTotp(code: string, now = Date.now()) {
    return getMatchingAdminTotpCounter(code, now) !== null;
}
