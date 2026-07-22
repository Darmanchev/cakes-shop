const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export function getRequiredSecret(
    name: 'RATE_LIMIT_SECRET' | 'PII_ENCRYPTION_KEY' | 'TURNSTILE_SECRET_KEY',
) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is not configured`);
    }

    return value;
}

export function validateRateLimitSecret(secret: string) {
    if (Buffer.byteLength(secret, 'utf8') < 32) {
        throw new Error('RATE_LIMIT_SECRET must contain at least 32 bytes');
    }

    return secret;
}

export function validateDatabaseUrl(databaseUrl: string) {
    let url: URL;

    try {
        url = new URL(databaseUrl);
    } catch {
        throw new Error('DATABASE_URL is not a valid URL');
    }

    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
        throw new Error('DATABASE_URL must use PostgreSQL');
    }

    if (process.env.NODE_ENV === 'production' &&
        process.env.NEXT_PHASE !== 'phase-production-build'
    ) {
        const sslMode = url.searchParams.get('sslmode');

        if (!['require', 'verify-ca', 'verify-full'].includes(sslMode ?? '')) {
            throw new Error(
                'Production DATABASE_URL must require TLS with sslmode=require, verify-ca, or verify-full',
            );
        }

        if (LOCAL_DATABASE_HOSTS.has(url.hostname) && sslMode !== 'verify-full') {
            throw new Error('Production DATABASE_URL must not use a local database host');
        }
    }

    return databaseUrl;
}
