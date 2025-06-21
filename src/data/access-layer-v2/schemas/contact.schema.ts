import { pgTable, serial, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const contacts = pgTable('contacts', {
	id: serial('id').primaryKey(),
	firstName: varchar('first_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }),
	phone: varchar('phone', { length: 255 }),
    passportNumber: varchar('passport_number', { length: 255 }),
    birthYear: integer('birth_year'),
    gender: varchar('gender', { length: 255 }),
    title: varchar('title', { length: 255 }),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow(),
	addedBy: integer('added_by').references(() => users.id, { onDelete: 'set null' }),
});

export const contacts_relations = relations(contacts, ({ one, many }) => ({
	addedBy: one(users, {
		fields: [contacts.addedBy],
		references: [users.id],
		relationName: 'added_by',
	}),
}));

export type Contact = InferSelectModel<typeof contacts>;