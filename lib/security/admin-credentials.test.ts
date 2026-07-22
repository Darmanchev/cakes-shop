import assert from 'node:assert/strict';
import {scryptSync} from 'node:crypto';
import {afterEach, describe, it} from 'node:test';
import {
    createAdminTotpForTest,
    getMatchingAdminTotpCounter,
    verifyAdminPassword,
    verifyAdminTotp,
} from './admin-credentials';

const originalPasswordHash = process.env.ADMIN_PASSWORD_HASH;
const originalTotpSecret = process.env.ADMIN_TOTP_SECRET;

afterEach(() => {
    if (originalPasswordHash === undefined) delete process.env.ADMIN_PASSWORD_HASH;
    else process.env.ADMIN_PASSWORD_HASH = originalPasswordHash;
    if (originalTotpSecret === undefined) delete process.env.ADMIN_TOTP_SECRET;
    else process.env.ADMIN_TOTP_SECRET = originalTotpSecret;
});

describe('admin credentials', () => {
    it('verifies scrypt password hashes without accepting another password', () => {
        const salt = Buffer.alloc(16, 5);
        const hash = scryptSync('correct horse', salt, 64);
        process.env.ADMIN_PASSWORD_HASH = `scrypt$${salt.toString('base64url')}$${hash.toString('base64url')}`;

        assert.equal(verifyAdminPassword('correct horse'), true);
        assert.equal(verifyAdminPassword('wrong horse'), false);
    });

    it('accepts clock skew but returns the exact counter for replay prevention', () => {
        const secret = 'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP';
        const counter = 2_000_000;
        const now = counter * 30 * 1000;
        process.env.ADMIN_TOTP_SECRET = secret;

        const previousCode = createAdminTotpForTest(secret, counter - 1);
        assert.equal(getMatchingAdminTotpCounter(previousCode, now), counter - 1);
        assert.equal(verifyAdminTotp(previousCode, now), true);
        assert.equal(verifyAdminTotp('00000x', now), false);
    });
});
