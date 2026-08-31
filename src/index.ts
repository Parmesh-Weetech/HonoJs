import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config";
import { sql } from 'drizzle-orm';
import { db } from './db/db.js';
import userRoute from './routes/user.route.js';
import authRoute from './routes/auth.route.js';
import type { AppEnv } from './types/context.js';

export const app = new Hono<AppEnv>()

app.route('/user', userRoute);
app.route('/auth', authRoute);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);

  db.execute(sql`SELECT 1`)
    .then(() => console.log('✅ Database connected successfully!'))
    .catch((err) => console.error('❌ Database connection failed:', err.message));
})
