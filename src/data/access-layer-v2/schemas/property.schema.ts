import { pgTable, serial, varchar, text, integer, numeric, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { users } from "./auth.schema";
import { files } from "./files.schema";
import { propertiesFiles } from "./properties-files.schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const properties = pgTable('properties', {
	id: serial('id').primaryKey(),
	title: varchar('title', { length: 255 }).notNull(),
	description: text('description').notNull(),
	price: numeric('price', { precision: 12, scale: 2 }).notNull(),
	location: varchar('location', { length: 255 }).notNull(),
	address: varchar('address', { length: 500 }).notNull(),
	bedrooms: integer('bedrooms').notNull(),
	bathrooms: integer('bathrooms').notNull(),
	area: numeric('area', { precision: 10, scale: 2 }).notNull(),
	propertyType: varchar('property_type', { 
		length: 50,
		enum: ['villa', 'apartment', 'house', 'commercial', 'land', 'other'] 
	}).notNull(),
	listingType: varchar('listing_type', { 
		length: 50,
		enum: ['sale', 'rent', 'both'] 
	}).notNull(),
	isAvailable: boolean('is_available').default(true).notNull(),
	isFeatured: boolean('is_featured').default(false).notNull(),
	amenities: jsonb('amenities').$type<string[]>().notNull().default([]),
	latitude: doublePrecision('latitude'),
	longitude: doublePrecision('longitude'),
	yearBuilt: integer('year_built'),
	parkingSpaces: integer('parking_spaces').default(0),
	agentName: varchar('agent_name', { length: 255 }),
	agentPhone: varchar('agent_phone', { length: 255 }),
	agentEmail: varchar('agent_email', { length: 255 }),
	virtualTourUrl: varchar('virtual_tour_url', { length: 500 }),
	monthlyRent: numeric('monthly_rent', { precision: 10, scale: 2 }),
	annualAppreciationRate: numeric('annual_appreciation_rate', { precision: 5, scale: 2 }),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date',
	}).defaultNow().notNull(),
	addedBy: integer('added_by').references(() => users.id, { onDelete: 'set null' }),
});

export const properties_relations = relations(properties, ({ one, many }) => ({
	addedByUser: one(users, {
		fields: [properties.addedBy],
		references: [users.id],
	}),
	propertyFiles: many(propertiesFiles),
}));

export type Property = InferSelectModel<typeof properties>;
export type PropertyType = 'villa' | 'apartment' | 'house' | 'commercial' | 'land' | 'other';
export type ListingType = 'sale' | 'rent' | 'both'; 