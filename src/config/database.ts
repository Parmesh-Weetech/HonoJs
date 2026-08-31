import { DataSource } from "typeorm";
import { env } from "../helper/env.js";
import { entities } from "../entities/index.js";

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    synchronize: true,
    entities: entities,
    logging: true,
    migrationsTableName: 'migrations',
})