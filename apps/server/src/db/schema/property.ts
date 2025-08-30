import {
	boolean,
	decimal,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organization } from "./organizations";

export const property = pgTable("property", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
	organizationId: uuid("organization_id").references(() => organization.id, {
		onDelete: "cascade",
	}),

	// Basic Information
	name: text("name").notNull(),
	description: text("description").notNull(),
	location: text("location").notNull(),

	// Property Details
	price: decimal("price", { precision: 12, scale: 2 }).notNull(),
	type: text("type").notNull(), // villa, apartment, house, condo, townhouse, commercial
	status: text("status").notNull().default("For Sale"), // For Sale, For Rent, Pending, Sold

	// Property Specifications
	bedrooms: integer("bedrooms"),
	bathrooms: decimal("bathrooms", { precision: 3, scale: 1 }),
	area: integer("area"), // in sq ft
	lotSize: integer("lot_size"), // in sq ft
	yearBuilt: integer("year_built"),
	parking: integer("parking").default(0),

	// Metadata
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyImage = pgTable("property_image", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id")
		.notNull()
		.references(() => property.id, { onDelete: "cascade" }),

	// R2 Storage Information
	objectKey: text("object_key").notNull(), // The key in R2 storage
	fileName: text("file_name").notNull(), // Original filename
	mimeType: text("mime_type").notNull(),
	fileSize: integer("file_size").notNull(), // in bytes

	// Image Metadata
	isPrimary: boolean("is_primary").notNull().default(false), // Main property image
	sortOrder: integer("sort_order").notNull().default(0), // Display order

	// Timestamps
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyAmenity = pgTable("property_amenity", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id")
		.notNull()
		.references(() => property.id, { onDelete: "cascade" }),

	name: text("name").notNull(), // e.g., "Ocean View", "Private Pool", etc.

	createdAt: timestamp("created_at").notNull().defaultNow(),
});
