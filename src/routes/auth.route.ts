import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";
import { AuthService } from "../services/auth.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import type { AppEnv } from "../types/context.js";

const app = new Hono<AppEnv>();
const authService = new AuthService();

app.post('/signup', zValidator('json', signupSchema), async (c) => {
    try {
        const { name, email, password } = c.req.valid('json');
        const user = await authService.signup(email, name ?? "", password);

        return c.json({ message: "User registered successfully", user }, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

app.post('/login', zValidator('json', loginSchema), async (c) => {
    try {
        const { email, password } = c.req.valid('json');
        const result = await authService.login(email, password);

        // Send HTTP-Only session token cookie to the client
        setCookie(c, 'session_token', result.session.token, {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            expires: result.session.expiresAt,
        });

        return c.json({
            message: "Login successful",
            user: result.user,
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 401);
    }
});

app.post('/logout', authMiddleware, async (c) => {
    try {
        const sessionId = c.get('sessionId');
        await authService.logout(sessionId);

        // Clear session cookie from client
        deleteCookie(c, 'session_token', { path: '/' });

        return c.json({ message: "Logged out successfully" });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

export const authRoute = app;
export default app;