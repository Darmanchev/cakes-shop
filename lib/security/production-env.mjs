const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

const REQUIRED = [
    'DATABASE_URL',
    'ADMIN_PASSWORD_HASH',
    'ADMIN_TOTP_SECRET',
    'RATE_LIMIT_SECRET',
    'PII_ENCRYPTION_KEY',
    'TRUSTED_PROXY_IP_HEADER',
    'TURNSTILE_SECRET_KEY',
    'TURNSTILE_EXPECTED_HOSTNAME',
    'TURNSTILE_SITE_KEY',
];

function required(name) {
    const value = process.env[name]?.trim();

    if (!value) {
        throw new Error(`${name} is required in production`);
    }

    return value;
}

function validateDatabaseUrl(databaseUrl) {
    let url;

    try {
        url = new URL(databaseUrl);
    } catch {
        throw new Error('DATABASE_URL is not a valid URL');
    }

    if (!['postgres:', 'postgresql:'].includes(url.protocol)) {
        throw new Error('DATABASE_URL must use PostgreSQL');
    }

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

export function validateProductionEnvironment() {
    for (const name of REQUIRED) {
        required(name);
    }

    validateDatabaseUrl(required('DATABASE_URL'));

    if (Buffer.byteLength(required('RATE_LIMIT_SECRET'), 'utf8') < 32) {
        throw new Error('RATE_LIMIT_SECRET must contain at least 32 bytes');
    }

    const piiKey = required('PII_ENCRYPTION_KEY');
    if (Buffer.from(piiKey, 'base64url').length !== 32 ||
        Buffer.from(piiKey, 'base64url').toString('base64url') !== piiKey.replace(/=+$/, '')
    ) {
        throw new Error('PII_ENCRYPTION_KEY must be a base64url-encoded 32-byte key');
    }

    if (!/^[!#$%&'*+\-.^_`|~0-9a-z]+$/i.test(required('TRUSTED_PROXY_IP_HEADER'))) {
        throw new Error('TRUSTED_PROXY_IP_HEADER is invalid');
    }

    const passwordHashParts = required('ADMIN_PASSWORD_HASH').split('$');
    if (passwordHashParts.length !== 3 || passwordHashParts[0] !== 'scrypt' ||
        Buffer.from(passwordHashParts[1], 'base64url').length < 16 ||
        Buffer.from(passwordHashParts[2], 'base64url').length < 32
    ) {
        throw new Error('ADMIN_PASSWORD_HASH has an invalid format');
    }

    const totpSecret = required('ADMIN_TOTP_SECRET');
    if (!/^[A-Z2-7]+=*$/i.test(totpSecret) || totpSecret.replace(/=+$/, '').length < 26) {
        throw new Error('ADMIN_TOTP_SECRET must contain at least 128 bits of base32 data');
    }

    if (/[:/]/.test(required('TURNSTILE_EXPECTED_HOSTNAME'))) {
        throw new Error('TURNSTILE_EXPECTED_HOSTNAME must be a hostname without scheme or path');
    }
}
