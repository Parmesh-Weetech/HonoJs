import { Hono } from 'hono';
import { UserService } from '../services/user.service.js';
import { zValidator } from '@hono/zod-validator';
import createUserSchema from '../schemas/CreateUserSchema.js';

const app = new Hono();

const userService = new UserService();

app.get('/', async (c) => {
    const users = await userService.getUsers();

    return c.json(users)
});

app.post('/', zValidator('json', createUserSchema), async (c) => {
    const body = await c.req.json();

    const user = await userService.createUser(body.name, body.email);

    return c.json(user);
});

export default app;