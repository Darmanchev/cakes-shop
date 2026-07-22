import 'server-only';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const MAX_TOKEN_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 5_000;

interface TurnstileResponse {
    success?: boolean;
    hostname?: string;
    action?: string;
}

function getTurnstileConfig() {
    const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
    const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
    const siteKey = process.env.TURNSTILE_SITE_KEY?.trim();

    if (!secret && !expectedHostname && !siteKey && process.env.NODE_ENV !== 'production') {
        return null;
    }

    if (!secret || !expectedHostname || !siteKey) {
        throw new Error(
            'TURNSTILE_SECRET_KEY, TURNSTILE_EXPECTED_HOSTNAME, and TURNSTILE_SITE_KEY must be configured together',
        );
    }

    return {secret, expectedHostname};
}

export async function verifyTurnstileToken(
    token: unknown,
    expectedAction: string,
    clientIp: string | null,
) {
    const config = getTurnstileConfig();

    if (!config) {
        return true;
    }

    if (typeof token !== 'string' || token.length < 1 || token.length > MAX_TOKEN_LENGTH) {
        return false;
    }

    try {
        const response = await fetch(SITEVERIFY_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                secret: config.secret,
                response: token,
                remoteip: clientIp ?? undefined,
            }),
            signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
            cache: 'no-store',
        });

        if (!response.ok) {
            return false;
        }

        const result = await response.json() as TurnstileResponse;

        return result.success === true
            && result.hostname === config.expectedHostname
            && result.action === expectedAction;
    } catch (error) {
        console.error('Turnstile verification failed', error);
        return false;
    }
}
