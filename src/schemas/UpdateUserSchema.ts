import { z } from 'zod';

const updateUserSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
});

export default updateUserSchema;