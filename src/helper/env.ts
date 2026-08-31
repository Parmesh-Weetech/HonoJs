import dotenv from "dotenv";
dotenv.config({ path: '.env' });

import { z } from 'zod';

const envSchema = z.object({
    DB_HOST: z.string().nonempty(),
    DB_PORT: z.string().regex(/^\d+$/, { message: 'DB_PORT must be a number' }),
    DB_NAME: z.string().nonempty(),
    DB_USER: z.string().nonempty(),
    DB_PASSWORD: z.string().nonempty(),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success) {
    console.error('Invalid environment variables: ', parsed.error.format());
    throw new Error("Invalid environment variables: " + JSON.stringify(parsed.error.format()));
}

export const env = parsed.data;