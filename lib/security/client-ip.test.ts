import assert from 'node:assert/strict';
import {afterEach, describe, it} from 'node:test';
import {getClientIdentifier, normalizeClientIp} from './client-ip';

const originalHeaderName = process.env.TRUSTED_PROXY_IP_HEADER;

afterEach(() => {
    if (originalHeaderName === undefined) {
        delete process.env.TRUSTED_PROXY_IP_HEADER;
    } else {
        process.env.TRUSTED_PROXY_IP_HEADER = originalHeaderName;
    }
});

describe('normalizeClientIp', () => {
    it('accepts and canonicalizes IP addresses', () => {
        assert.equal(normalizeClientIp(' 192.0.2.1 '), '192.0.2.1');
        assert.equal(normalizeClientIp('2001:0DB8:0:0:0:0:0:1'), '2001:db8::1');
        assert.equal(normalizeClientIp('::ffff:192.0.2.1'), '192.0.2.1');
        assert.equal(normalizeClientIp('::ffff:c000:201'), '192.0.2.1');
    });

    it('rejects invalid values and forwarded chains', () => {
        assert.equal(normalizeClientIp(null), null);
        assert.equal(normalizeClientIp('not-an-ip'), null);
        assert.equal(normalizeClientIp('192.0.2.1, 198.51.100.2'), null);
        assert.equal(normalizeClientIp('192.0.2.1:443'), null);
    });
});

describe('getClientIdentifier', () => {
    it('trusts only the configured header', () => {
        process.env.TRUSTED_PROXY_IP_HEADER = 'cf-connecting-ip';
        const headers = new Headers({
            'cf-connecting-ip': '192.0.2.1',
            'x-forwarded-for': '198.51.100.2',
            'x-real-ip': '203.0.113.3',
        });

        assert.equal(getClientIdentifier(headers), 'ip:192.0.2.1');
    });

    it('fails closed when configuration or input is invalid', () => {
        delete process.env.TRUSTED_PROXY_IP_HEADER;
        assert.equal(
            getClientIdentifier(new Headers({'x-forwarded-for': '198.51.100.2'})),
            'ip:127.0.0.1',
        );

        process.env.TRUSTED_PROXY_IP_HEADER = 'x-forwarded-for';
        assert.equal(
            getClientIdentifier(new Headers({'x-forwarded-for': '192.0.2.1, 198.51.100.2'})),
            null,
        );
    });
});
