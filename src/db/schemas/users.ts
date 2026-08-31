import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),

    email: varchar("email", {
        length: 255,
    })
        .notNull()
        .unique(),

    passwordHash: varchar("password_hash", {
        length: 255,
    }),

    name: varchar("name", {
        length: 100,
    }),

    isEmailVerified: boolean("is_email_verified")
        .notNull()
        .default(false),

    isActive: boolean("is_active")
        .notNull()
        .default(true),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    })
        .notNull()
        .defaultNow(),
});