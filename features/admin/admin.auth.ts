import 'server-only';

import {createHash, randomBytes} from 'node:crypto';
import {Prisma} from '@prisma/client';
import {prisma} from '@/lib/prisma';
import {hashSecurityIdentifier} from '@/lib/security/rate-limit';
import {
    getMatchingAdminTotpCounter,
    verifyAdminPassword,
} from '@/lib/security/admin-credentials';

export {verifyAdminPassword, verifyAdminTotp} from '@/lib/security/admin-credentials';

export const ADMIN_SESSION_COOKIE = 'admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
export const MAX_ACTIVE_ADMIN_SESSIONS = 5;

const LOGIN_AUDIT_RETENTION_DAYS = 90;

function hashSessionToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
}


async function recordLoginEvent(identifier: string, outcome: string) {
    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - LOGIN_AUDIT_RETENTION_DAYS);

    await prisma.$transaction([
        prisma.adminLoginEvent.create({
            data: {
                identifierHash: hashSecurityIdentifier(identifier),
                outcome,
            },
        }),
        prisma.adminLoginEvent.deleteMany({where: {createdAt: {lt: cutoff}}}),
    ]);
}

export async function authenticateAdmin(
    password: string,
    totp: string,
    identifier: string,
) {
    if (!verifyAdminPassword(password)) {
        await recordLoginEvent(identifier, 'INVALID_CREDENTIALS');
        return null;
    }

    const counter = getMatchingAdminTotpCounter(totp);

    if (counter === null) {
        await recordLoginEvent(identifier, 'INVALID_CREDENTIALS');
        return null;
    }

    const token = randomBytes(32).toString('base64url');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000);
    const staleAuditCutoff = new Date(now);
    staleAuditCutoff.setUTCDate(staleAuditCutoff.getUTCDate() - LOGIN_AUDIT_RETENTION_DAYS);

    try {
        await prisma.$transaction(async (tx) => {
            await tx.adminTotpUse.create({data: {counter: BigInt(counter)}});
            await tx.$queryRaw(Prisma.sql`
                SELECT pg_advisory_xact_lock(hashtext('admin-session-cap'))
            `);
            await tx.adminTotpUse.deleteMany({
                where: {usedAt: {lt: new Date(now.getTime() - 5 * 60 * 1000)}},
            });
            await tx.adminSession.deleteMany({where: {expiresAt: {lte: now}}});

            const oldestSessions = await tx.adminSession.findMany({
                orderBy: {createdAt: 'asc'},
                select: {tokenHash: true},
            });

            if (oldestSessions.length >= MAX_ACTIVE_ADMIN_SESSIONS) {
                const sessionsToDelete = oldestSessions.slice(
                    0,
                    oldestSessions.length - MAX_ACTIVE_ADMIN_SESSIONS + 1,
                );
                await tx.adminSession.deleteMany({
                    where: {tokenHash: {in: sessionsToDelete.map((session) => session.tokenHash)}},
                });
            }

            await tx.adminSession.create({
                data: {
                    tokenHash: hashSessionToken(token),
                    expiresAt,
                    lastSeenAt: now,
                },
            });
            await tx.adminLoginEvent.create({
                data: {
                    identifierHash: hashSecurityIdentifier(identifier),
                    outcome: 'SUCCESS',
                },
            });
            await tx.adminLoginEvent.deleteMany({where: {createdAt: {lt: staleAuditCutoff}}});
        });

        return token;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            await recordLoginEvent(identifier, 'TOTP_REPLAY');
            return null;
        }

        throw error;
    }
}

export async function verifyAdminSessionToken(token: string | undefined) {
    if (!token || token.length > 128) {
        return false;
    }

    const tokenHash = hashSessionToken(token);
    const session = await prisma.adminSession.findUnique({where: {tokenHash}});

    if (!session) {
        return false;
    }

    const now = new Date();

    if (session.expiresAt <= now) {
        await prisma.adminSession.delete({where: {tokenHash}}).catch(() => undefined);
        return false;
    }

    if (now.getTime() - session.lastSeenAt.getTime() > 5 * 60 * 1000) {
        await prisma.adminSession.updateMany({
            where: {tokenHash, expiresAt: {gt: now}},
            data: {lastSeenAt: now},
        });
    }

    return true;
}

export async function revokeAdminSession(token: string | undefined) {
    if (!token || token.length > 128) {
        return;
    }

    await prisma.adminSession.deleteMany({
        where: {tokenHash: hashSessionToken(token)},
    });
}

export async function revokeAllAdminSessions() {
    await prisma.adminSession.deleteMany();
}

export async function getAdminSecuritySummary() {
    const now = new Date();
    const [activeSessions, loginEvents] = await prisma.$transaction([
        prisma.adminSession.count({where: {expiresAt: {gt: now}}}),
        prisma.adminLoginEvent.findMany({
            orderBy: {createdAt: 'desc'},
            take: 20,
            select: {id: true, identifierHash: true, outcome: true, createdAt: true},
        }),
    ]);

    return {
        activeSessions,
        loginEvents: loginEvents.map((event) => ({
            ...event,
            identifierHash: event.identifierHash.slice(0, 12),
        })),
    };
}
