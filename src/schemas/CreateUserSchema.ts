import { z } from 'zod';

const createUserSchema = z.object({
    id: z.string().uuid({
        version: 'v4'
    }).optional(),
    name: z.string().min(1),
    email: z.string().email(),
});

export default createUserSchema;