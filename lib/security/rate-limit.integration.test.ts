import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {clearRateLimit, consumeRateLimit} from './rate-limit';

const runDatabaseTests = process.env.RUN_DB_TESTS === '1';

describe('persistent rate limit concurrency', {skip: !runDatabaseTests}, () => {
    it('allows exactly the configured number under concurrent load', async () => {
        const identifier = `integration-${crypto.randomUUID()}`;
        const options = {
            scope: 'integration-concurrency',
            identifier,
            limit: 5,
            windowMs: 60_000,
        };

        try {
            const results = await Promise.all(
                Array.from({length: 20}, () => consumeRateLimit(options)),
            );

            assert.equal(results.filter((result) => result.allowed).length, 5);
            assert.equal(results.filter((result) => !result.allowed).length, 15);
        } finally {
            await clearRateLimit(options.scope, identifier);
        }
    });
});
