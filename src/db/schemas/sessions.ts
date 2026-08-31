import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const sessions = pgTable(
    "sessions",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        tokenHash: varchar("token_hash", {
            length: 64,
        })
            .notNull()
            .unique(),

        expiresAt: timestamp("expires_at", {
            withTimezone: true,
        }).notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .notNull()
            .defaultNow(),

        lastUsedAt: timestamp("last_used_at", {
            withTimezone: true,
        }),

        revokedAt: timestamp("revoked_at", {
            withTimezone: true,
        }),
    },
    (table) => [
        index("sessions_user_id_idx").on(table.userId),
        index("sessions_expires_at_idx").on(table.expiresAt),
    ],
);