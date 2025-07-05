import { pgTable, serial, integer, timestamp, boolean, index } from "drizzle-orm/pg-core";
import { InferSelectModel, relations } from "drizzle-orm";
import { properties } from "./property.schema";
import { files } from "./files.schema";

export const propertiesFiles = pgTable('properties_files', {
	id: serial('id').primaryKey(),
	propertyId: integer('property_id').notNull().references(() => properties.id, { onDelete: 'cascade' }),
	fileId: integer('file_id').notNull().references(() => files.id, { onDelete: 'cascade' }),
	isPrimary: boolean('is_primary').default(false).notNull(),
	displayOrder: integer('display_order').default(0).notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow().notNull(),
}, (table) => [
	index('property_id_idx').on(table.propertyId),
	index('file_id_idx').on(table.fileId),
]);

export const propertiesFiles_relations = relations(propertiesFiles, ({ one }) => ({
	property: one(properties, {
		fields: [propertiesFiles.propertyId],
		references: [properties.id],
	}),
	file: one(files, {
		fields: [propertiesFiles.fileId],
		references: [files.id],
	}),
}));

export type PropertyFile = InferSelectModel<typeof propertiesFiles>; 