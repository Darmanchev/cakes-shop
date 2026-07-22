import {createCipheriv, createDecipheriv, createHash, randomBytes} from 'node:crypto';

const ENCRYPTED_PREFIX = 'enc:v1';
const KEY_BYTES = 32;
const IV_BYTES = 12;

function getEncryptionKey() {
    const encoded = process.env.PII_ENCRYPTION_KEY?.trim();

    if (!encoded && process.env.NODE_ENV !== 'production') {
        return createHash('sha256')
            .update('stas-cakes-local-development-pii-key')
            .digest();
    }

    if (!encoded) {
        throw new Error('PII_ENCRYPTION_KEY is not configured');
    }

    const key = Buffer.from(encoded, 'base64url');

    if (key.length !== KEY_BYTES || key.toString('base64url') !== encoded.replace(/=+$/, '')) {
        throw new Error('PII_ENCRYPTION_KEY must be a base64url-encoded 32-byte key');
    }

    return key;
}

export function isEncryptedPii(value: string) {
    return value.startsWith(`${ENCRYPTED_PREFIX}:`);
}

export function encryptPii(value: string) {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
    const ciphertext = Buffer.concat([
        cipher.update(value, 'utf8'),
        cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return [
        ENCRYPTED_PREFIX,
        iv.toString('base64url'),
        ciphertext.toString('base64url'),
        tag.toString('base64url'),
    ].join(':');
}

export function decryptPii(value: string) {
    if (!isEncryptedPii(value)) {
        // Allows a controlled one-time migration of rows created before
        // encryption was introduced. New writes are always encrypted.
        return value;
    }

    const [prefix, version, ivEncoded, ciphertextEncoded, tagEncoded, extra] = value.split(':');

    if (`${prefix}:${version}` !== ENCRYPTED_PREFIX || extra !== undefined) {
        throw new Error('Encrypted PII has an invalid format');
    }

    try {
        const decipher = createDecipheriv(
            'aes-256-gcm',
            getEncryptionKey(),
            Buffer.from(ivEncoded, 'base64url'),
        );
        decipher.setAuthTag(Buffer.from(tagEncoded, 'base64url'));

        return Buffer.concat([
            decipher.update(Buffer.from(ciphertextEncoded, 'base64url')),
            decipher.final(),
        ]).toString('utf8');
    } catch {
        throw new Error('Encrypted PII could not be authenticated');
    }
}

interface PiiFields {
    name: string;
    phone: string;
    email: string;
    deliveryAddress: string;
    comment: string | null;
}

export function encryptOrderPii<T extends PiiFields>(order: T): T {
    return {
        ...order,
        name: encryptPii(order.name),
        phone: encryptPii(order.phone),
        email: encryptPii(order.email),
        deliveryAddress: encryptPii(order.deliveryAddress),
        comment: order.comment === null ? null : encryptPii(order.comment),
    };
}

export function decryptOrderPii<T extends PiiFields>(order: T): T {
    return {
        ...order,
        name: decryptPii(order.name),
        phone: decryptPii(order.phone),
        email: decryptPii(order.email),
        deliveryAddress: decryptPii(order.deliveryAddress),
        comment: order.comment === null ? null : decryptPii(order.comment),
    };
}
