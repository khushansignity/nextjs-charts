import { date, numeric, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const auth_users = pgTable('auth_users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    role: varchar('role', { length: 20 }).notNull().default('member'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
});

export const balances = pgTable('balances', {
    id: serial('id').primaryKey(),
    date: date('date').notNull(),
    mainamount: numeric('mainamount', { precision: 12, scale: 2 }).notNull(),
    stcamount: numeric('stcamount', { precision: 12, scale: 2 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
});

export type User = typeof auth_users.$inferSelect;
export type NewUser = typeof auth_users.$inferInsert;
export type Transaction = typeof balances.$inferSelect;
export type NewTransaction = typeof balances.$inferInsert;