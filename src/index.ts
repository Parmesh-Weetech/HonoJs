import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import "dotenv/config";
import { sql } from 'drizzle-orm';
import { db } from './db/db.js';
import userRoute from './routes/user.route.js';

export const app = new Hono()

app.route('/user', userRoute);

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);

  db.execute(sql`SELECT 1`)
    .then(() => console.log('✅ Database connected successfully!'))
    .catch((err) => console.error('❌ Database connection failed:', err.message));
})
