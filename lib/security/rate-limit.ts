import 'server-only';

import {createHmac} from 'node:crypto';
import {Prisma} from '@prisma/client';
import {prisma} from '@/lib/prisma';

interface RateLimitOptions {
    scope: string;
    identifier: string;
    limit: number;
    windowMs: number;
}

function getRateLimitSecret() {
    const secret = process.env.RATE_LIMIT_SECRET;

    if (secret) {
        return secret;
    }

    if (process.env.NODE_ENV === 'production') {
        throw new Error('RATE_LIMIT_SECRET is not configured');
    }

    return 'local-development-rate-limit-secret';
}

function hashIdentifier(identifier: string) {
    return createHmac('sha256', getRateLimitSecret())
        .update(identifier)
        .digest('hex');
}

export function getClientIdentifier(headers: Headers) {
    const forwardedFor = headers.get('x-forwarded-for')?.split(',')[0]?.trim();

    return headers.get('cf-connecting-ip')
        ?? headers.get('x-real-ip')
        ?? forwardedFor
        ?? 'unknown-client';
}

export async function consumeRateLimit(options: RateLimitOptions) {
    const now = new Date();
    const nextReset = new Date(now.getTime() + options.windowMs);
    const key = hashIdentifier(options.identifier);

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
            key: hashIdentifier(identifier),
        },
    });
}
