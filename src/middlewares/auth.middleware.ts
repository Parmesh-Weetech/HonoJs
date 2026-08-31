import type { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import crypto from 'node:crypto';
import { db } from '../db/db.js';
import { sessions, users } from '../db/schema.js';
import type { AppEnv } from '../types/context.js';

export async function authMiddleware(
    c: Context<AppEnv>,
    next: Next,
) {
    const token = getCookie(c, 'session_token');

    if (!token) {
        return c.json(
            {
                message: 'Unauthorized',
            },
            401,
        );
    }

    const tokenHash = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const [result] = await db
        .select({
            sessionId: sessions.id,
            userId: users.id,
            email: users.email,
            name: users.name,
            expiresAt: sessions.expiresAt,
            revokedAt: sessions.revokedAt,
            isActive: users.isActive,
        })
        .from(sessions)
        .innerJoin(
            users,
            eq(sessions.userId, users.id),
        )
        .where(eq(sessions.tokenHash, tokenHash))
        .limit(1);

    if (!result) {
        return c.json(
            {
                message: 'Unauthorized',
            },
            401,
        );
    }

    if (result.revokedAt) {
        return c.json(
            {
                message: 'Session has been revoked',
            },
            401,
        );
    }

    if (result.expiresAt < new Date()) {
        return c.json(
            {
                message: 'Session has expired',
            },
            401,
        );
    }

    if (!result.isActive) {
        return c.json(
            {
                message: 'Account is disabled',
            },
            401,
        );
    }

    c.set('user', {
        id: result.userId,
        email: result.email,
        name: result.name,
    });

    c.set('sessionId', result.sessionId);

    await next();
}