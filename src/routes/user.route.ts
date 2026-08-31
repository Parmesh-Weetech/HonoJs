import { Hono } from 'hono';
import { UserService } from '../services/user.service.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import type { AppEnv } from '../types/context.js';

const app = new Hono<AppEnv>();
const userService = new UserService();

app.get('/profile', authMiddleware, async (c) => {
    try {
        // Strongly-typed! c.get('user') returns AuthUser { id, email, name }
        const user = c.get('user');

        return c.json({
            user,
        });
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

app.get('/', async (c) => {
    try {
        const users = await userService.getUsers();
        return c.json(users);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

app.get('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const user = await userService.getUserById(id);
        return c.json(user);
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

app.post('/', async (c) => {
    try {
        const body = await c.req.json();
        const user = await userService.createUser(body.name, body.email);
        return c.json(user, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

app.put('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const user = await userService.updateUser(id, body.name, body.email);
        return c.json(user);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

app.delete('/:id', async (c) => {
    try {
        const id = c.req.param('id');
        const result = await userService.deleteUserById(id);
        return c.text(result);
    } catch (error: any) {
        return c.json({ error: error.message }, 404);
    }
});

export const userRoute = app;
export default app;
