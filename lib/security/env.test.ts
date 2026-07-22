import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {validateDatabaseUrl, validateRateLimitSecret} from './env';

const originalNodeEnv = process.env.NODE_ENV;
const originalNextPhase = process.env.NEXT_PHASE;

function setEnvironment(name: 'NODE_ENV' | 'NEXT_PHASE', value: string | undefined) {
    if (value === undefined) {
        delete process.env[name];
        return;
    }

    (process.env as Record<string, string | undefined>)[name] = value;
}

afterEach(() => {
    setEnvironment('NODE_ENV', originalNodeEnv);
    setEnvironment('NEXT_PHASE', originalNextPhase);
});

describe('production environment validation', () => {
    it('requires database TLS at runtime', () => {
        setEnvironment('NODE_ENV', 'production');
        delete process.env.NEXT_PHASE;

        assert.throws(
            () => validateDatabaseUrl('postgresql://user:pass@db.example.com/app'),
            /must require TLS/,
        );
        assert.equal(
            validateDatabaseUrl('postgresql://user:pass@db.example.com/app?sslmode=verify-full'),
            'postgresql://user:pass@db.example.com/app?sslmode=verify-full',
        );
    });

    it('permits a local URL only during the Next production build phase', () => {
        setEnvironment('NODE_ENV', 'production');
        setEnvironment('NEXT_PHASE', 'phase-production-build');

        assert.doesNotThrow(() => validateDatabaseUrl('postgresql://localhost/app'));
    });

    it('requires a sufficiently long rate-limit secret', () => {
        assert.throws(() => validateRateLimitSecret('too-short'), /at least 32 bytes/);
        assert.equal(validateRateLimitSecret('x'.repeat(32)), 'x'.repeat(32));
    });
});
