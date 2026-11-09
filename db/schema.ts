import { index, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export const links = pgTable(
	'links',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id').notNull(),
		shortCode: text('short_code').notNull(),
		originalUrl: text('original_url').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('links_user_id_idx').on(table.userId),
		uniqueIndex('links_short_code_unique').on(table.shortCode),
	],
);
