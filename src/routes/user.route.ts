import { Hono } from 'hono';
import { UserService } from '../services/user.service.js';
import { zValidator } from '@hono/zod-validator';
import createUserSchema from '../schemas/CreateUserSchema.js';
import updateUserSchema from '../schemas/UpdateUserSchema.js';

const app = new Hono();

const userService = new UserService();

app.get('/', async (c) => {
    const users = await userService.getUsers();

    return c.json(users)
});

app.get('/:id', async (c) => {
    const id = c.req.param('id');

    const user = await userService.getUserById(id);
    
    return c.json(user);
});

app.post('/', zValidator('json', createUserSchema), async (c) => {
    const body = await c.req.json();

    const user = await userService.createUser(body.name, body.email);

    return c.json(user);
});

app.put('/:id', zValidator('json', updateUserSchema), async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();

    const user = await userService.updateUser(id, body.name, body.email);

    return c.json(user);
});

app.delete('/:id', async (c) => {
    const id = c.req.param('id');

    const deletedUserData = await userService.deleteUserById(id);

    return c.text(deletedUserData);
})

export default app;