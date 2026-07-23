import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {validateProductionEnvironment} from './production-env.mjs';

const ENVIRONMENT_NAMES = [
    'DATABASE_URL',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_TOTP_SECRET',
    'RATE_LIMIT_SECRET',
    'PII_ENCRYPTION_KEY',
    'TRUSTED_PROXY_IP_HEADER',
    'TURNSTILE_SECRET_KEY',
    'TURNSTILE_EXPECTED_HOSTNAME',
    'TURNSTILE_SITE_KEY',
] as const;

const originalEnvironment = Object.fromEntries(
    ENVIRONMENT_NAMES.map((name) => [name, process.env[name]]),
);

function setValidProductionEnvironment() {
    process.env.DATABASE_URL =
        'postgresql://deploy:secret@db.example.com:5432/cakes?sslmode=verify-full';
    process.env.ADMIN_PASSWORD_HASH =
        'scrypt$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    process.env.ADMIN_TOTP_SECRET = 'AAAAAAAAAAAAAAAAAAAAAAAAAA';
    process.env.RATE_LIMIT_SECRET = '0123456789abcdef0123456789abcdef';
    process.env.PII_ENCRYPTION_KEY =
        'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    process.env.TRUSTED_PROXY_IP_HEADER = 'cf-connecting-ip';
    process.env.TURNSTILE_SECRET_KEY = 'secret-key';
    process.env.TURNSTILE_EXPECTED_HOSTNAME = 'cakes.example.com';
    process.env.TURNSTILE_SITE_KEY = 'site-key';
}

afterEach(() => {
    for (const name of ENVIRONMENT_NAMES) {
        const originalValue = originalEnvironment[name];

        if (originalValue === undefined) {
            delete process.env[name];
        } else {
            process.env[name] = originalValue;
        }
    }
});

describe('production environment validation', () => {
    it('accepts a complete secure configuration', () => {
        setValidProductionEnvironment();

        assert.doesNotThrow(validateProductionEnvironment);
    });

    it('rejects missing secrets', () => {
        setValidProductionEnvironment();
        delete process.env.PII_ENCRYPTION_KEY;

        assert.throws(
            validateProductionEnvironment,
            /PII_ENCRYPTION_KEY is required in production/,
        );
    });

    it('rejects a database connection without TLS', () => {
        setValidProductionEnvironment();
        process.env.DATABASE_URL =
            'postgresql://deploy:secret@db.example.com:5432/cakes';

        assert.throws(
            validateProductionEnvironment,
            /DATABASE_URL must require TLS/,
        );
    });
});
