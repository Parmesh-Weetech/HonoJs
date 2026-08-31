import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { sessions, users } from "../db/schema.js";
import crypto from 'node:crypto';

export class AuthService {
    async signup(email: string, name: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();

        // Destructure array to get single user object directly
        const [existingUser] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                email: normalizedEmail,
                name,
                passwordHash: hashedPassword,
                isEmailVerified: true,
                isActive: true,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                isEmailVerified: users.isEmailVerified,
                isActive: users.isActive,
            });

        return newUser;
    }

    async login(email: string, password: string) {
        const normalizedEmail = email.trim().toLowerCase();

        // Destructure array to get single user object directly
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);

        if (!user || !user.passwordHash) {
            throw new Error("Invalid email or password");
        }

        if (!user.isEmailVerified) {
            throw new Error("Please verify your email");
        }

        if (!user.isActive) {
            throw new Error("Account is not active");
        }

        const isValidPassword = await verifyPassword(password, user.passwordHash);

        if (!isValidPassword) {
            throw new Error("Invalid email or password");
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');

        const tokenHash = crypto
            .createHash('sha256')
            .update(sessionToken)
            .digest('hex');

        const expiresAt = new Date();

        expiresAt.setDate(expiresAt.getDate() + 30);

        const [session] = await db
            .insert(sessions)
            .values({
                userId: user.id,
                tokenHash,
                expiresAt,
            })
            .returning({
                id: sessions.id,
                expiresAt: sessions.expiresAt,
            });

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            session: {
                id: session.id,
                token: sessionToken,
                expiresAt: session.expiresAt,
            },
        };
    }

    async logout(sessionId: string) {
        if (!sessionId) return;

        await db
            .update(sessions)
            .set({ revokedAt: new Date() })
            .where(eq(sessions.id, sessionId));
    }
}