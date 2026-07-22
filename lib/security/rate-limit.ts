import {createHmac} from 'node:crypto';
import {Prisma} from '@prisma/client';
import {prisma} from '@/lib/prisma';
import {validateRateLimitSecret} from '@/lib/security/env';

export {getClientIdentifier} from '@/lib/security/client-ip';

interface RateLimitOptions {
    scope: string;
    identifier: string;
    limit: number;
    windowMs: number;
}

function getRateLimitSecret() {
    const secret = process.env.RATE_LIMIT_SECRET;

    if (secret) {
        return process.env.NODE_ENV === 'production'
            ? validateRateLimitSecret(secret)
            : secret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('RATE_LIMIT_SECRET is not configured');
    }

    return 'local-development-rate-limit-secret';
}

export function hashSecurityIdentifier(identifier: string) {
    return createHmac('sha256', getRateLimitSecret())
        .update(identifier)
        .digest('hex');
}

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let nextCleanupAt = 0;

async function deleteExpiredRateLimits(now: Date) {
    const nowMs = now.getTime();

    if (nowMs < nextCleanupAt) {
        return;
    }

    // Set the deadline before awaiting so concurrent requests do not all run
    // the same cleanup. Every application instance performs this periodically.
    nextCleanupAt = nowMs + CLEANUP_INTERVAL_MS;

    try {
        await prisma.rateLimit.deleteMany({
            where: {resetAt: {lte: now}},
        });
    } catch (error) {
        console.error('Failed to delete expired rate limits', error);
    }
}

export async function consumeRateLimit(options: RateLimitOptions) {
    if (!Number.isInteger(options.limit) || options.limit < 1 ||
        !Number.isInteger(options.windowMs) || options.windowMs < 1 ||
        options.scope.length < 1 || options.scope.length > 100 ||
        options.identifier.length < 1
    ) {
        throw new Error('Invalid rate limit options');
    }

    const now = new Date();
    const nextReset = new Date(now.getTime() + options.windowMs);
    const key = hashSecurityIdentifier(options.identifier);

    await deleteExpiredRateLimits(now);

    const rows = await prisma.$queryRaw<Array<{count: number; resetAt: Date}>>(Prisma.sql`
        INSERT INTO "RateLimit" ("scope", "key", "count", "resetAt", "updatedAt")
        VALUES (${options.scope}, ${key}, 1, ${nextReset}, ${now})
        ON CONFLICT ("scope", "key") DO UPDATE SET
            "count" = CASE
                WHEN "RateLimit"."resetAt" <= ${now} THEN 1
                ELSE "RateLimit"."count" + 1
            END,
            "resetAt" = CASE
                WHEN "RateLimit"."resetAt" <= ${now} THEN ${nextReset}
                ELSE "RateLimit"."resetAt"
            END,
            "updatedAt" = ${now}
        RETURNING "count", "resetAt"
    `);

    const result = rows[0];
    const retryAfterSeconds = Math.max(
        1,
        Math.ceil((result.resetAt.getTime() - now.getTime()) / 1000),
    );

    return {
        allowed: result.count <= options.limit,
        remaining: Math.max(0, options.limit - result.count),
        retryAfterSeconds,
    };
}

export async function clearRateLimit(scope: string, identifier: string) {
    await prisma.rateLimit.deleteMany({
        where: {
            scope,
            key: hashSecurityIdentifier(identifier),
        },
    });
}
