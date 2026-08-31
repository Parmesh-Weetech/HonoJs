import 'reflect-metadata';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import userRoute from './routes/user.route.js';
import dotenv from "dotenv";
import { AppDataSource } from './config/database.js';

dotenv.config({ path: '.env' });

const app = new Hono()

app.route('user', userRoute);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected!')
    }).catch((error) => {
      console.log("Error while connecting to database", error.message)
    })
  console.log(`Server is running on http://localhost:${info.port}`)
})
