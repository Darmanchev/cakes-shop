import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {decryptOrderPii, decryptPii, encryptOrderPii, encryptPii} from './pii';

const originalKey = process.env.PII_ENCRYPTION_KEY;

afterEach(() => {
    if (originalKey === undefined) {
        delete process.env.PII_ENCRYPTION_KEY;
    } else {
        process.env.PII_ENCRYPTION_KEY = originalKey;
    }
});

describe('PII encryption', () => {
    it('round-trips values and uses a random authenticated ciphertext', () => {
        process.env.PII_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString('base64url');
        const first = encryptPii('Иван Петров');
        const second = encryptPii('Иван Петров');

        assert.notEqual(first, second);
        assert.match(first, /^enc:v1:/);
        assert.equal(decryptPii(first), 'Иван Петров');
    });

    it('rejects modified ciphertext', () => {
        process.env.PII_ENCRYPTION_KEY = Buffer.alloc(32, 9).toString('base64url');
        const encrypted = encryptPii('secret');
        const parts = encrypted.split(':');
        parts[3] = `${parts[3].slice(0, -1)}${parts[3].endsWith('A') ? 'B' : 'A'}`;

        assert.throws(() => decryptPii(parts.join(':')), /authenticated/);
    });

    it('encrypts every directly identifying order field', () => {
        process.env.PII_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString('base64url');
        const order = {
            name: 'Иван',
            phone: '+359888123456',
            email: 'ivan@example.com',
            deliveryAddress: 'Sofia',
            comment: 'Call first',
            untouched: 42,
        };
        const encrypted = encryptOrderPii(order);

        for (const value of [encrypted.name, encrypted.phone, encrypted.email, encrypted.deliveryAddress, encrypted.comment]) {
            assert.match(value ?? '', /^enc:v1:/);
        }
        assert.deepEqual(decryptOrderPii(encrypted), order);
    });
});
