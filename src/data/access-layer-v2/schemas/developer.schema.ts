import { pgTable, serial, varchar, text, timestamp, integer } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const developers = pgTable('developers', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 255 }),
	companyInfo: text('company_info'),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow(),
	addedBy: integer('added_by').references(() => users.id, { onDelete: 'set null' }),
});

export const developers_relations = relations(developers, ({ one }) => ({
	addedBy: one(users, {
		fields: [developers.addedBy],
		references: [users.id],
		relationName: 'added_by',
	}),
}));

export type Developer = InferSelectModel<typeof developers>; 