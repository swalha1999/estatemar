import { z } from "zod";

// Property types enum
export const propertyTypeEnum = z.enum([
	"villa",
	"apartment",
	"house",
	"condo",
	"townhouse",
	"commercial",
]);

// Property status enum
export const propertyStatusEnum = z.enum([
	"For Sale",
	"For Rent",
	"Pending",
	"Sold",
]);

// Create property schema
export const createPropertySchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	price: z.number().positive(),
	type: propertyTypeEnum,
	status: propertyStatusEnum.default("For Sale"),
	bedrooms: z.number().int().positive().optional(),
	bathrooms: z.number().positive().optional(),
	area: z.number().int().positive().optional(),
	lotSize: z.number().int().positive().optional(),
	yearBuilt: z.number().int().positive().optional(),
	parking: z.number().int().nonnegative().optional(),
});

// Add property image schema
export const addPropertyImageSchema = z.object({
	propertyId: z.string(),
	objectKey: z.string(),
	fileName: z.string(),
	mimeType: z.string(),
	fileSize: z.number().int().positive(),
	isPrimary: z.boolean().default(false),
	sortOrder: z.number().int().nonnegative().default(0),
});

// Add property amenity schema
export const addPropertyAmenitySchema = z.object({
	propertyId: z.string(),
	name: z.string().min(1),
});

// Get properties schema
export const getPropertiesSchema = z.object({
	limit: z.number().int().positive().default(10),
	offset: z.number().int().nonnegative().default(0),
});

// Update property schema
export const updatePropertySchema = z.object({
	id: z.string().min(1, "Property ID is required"),
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	location: z.string().min(1).optional(),
	price: z.number().positive().optional(),
	type: propertyTypeEnum.optional(),
	status: propertyStatusEnum.optional(),
	bedrooms: z.number().int().positive().optional(),
	bathrooms: z.number().positive().optional(),
	area: z.number().int().positive().optional(),
	lotSize: z.number().int().positive().optional(),
	yearBuilt: z.number().int().positive().optional(),
	parking: z.number().int().nonnegative().optional(),
});

// Remove property image schema
export const removePropertyImageSchema = z.object({
	imageId: z.string().min(1, "Image ID is required"),
});

// Get property schema
export const getPropertySchema = z.object({
	id: z.string().min(1, "Property ID is required").trim(),
});

// Property schema (for responses)
export const propertySchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string(),
	location: z.string(),
	price: z.string(), // Stored as string in DB
	type: z.string(),
	status: z.string(),
	bedrooms: z.number().nullable(),
	bathrooms: z.string().nullable(), // Stored as string in DB
	area: z.number().nullable(),
	lotSize: z.number().nullable(),
	yearBuilt: z.number().nullable(),
	parking: z.number().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Property image schema
export const propertyImageSchema = z.object({
	id: z.string(),
	propertyId: z.string(),
	objectKey: z.string(),
	fileName: z.string(),
	mimeType: z.string(),
	fileSize: z.number(),
	isPrimary: z.boolean(),
	sortOrder: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Property amenity schema
export const propertyAmenitySchema = z.object({
	id: z.string(),
	propertyId: z.string(),
	name: z.string(),
	createdAt: z.date(),
});

// Property with images and amenities schema
export const propertyWithDetailsSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	description: z.string(),
	location: z.string(),
	price: z.string(),
	type: z.string(),
	status: z.string(),
	bedrooms: z.number().nullable(),
	bathrooms: z.string().nullable(),
	area: z.number().nullable(),
	lotSize: z.number().nullable(),
	yearBuilt: z.number().nullable(),
	parking: z.number().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	images: z.array(
		z.object({
			id: z.string(),
			propertyId: z.string(),
			objectKey: z.string(),
			fileName: z.string(),
			mimeType: z.string(),
			fileSize: z.number(),
			isPrimary: z.boolean(),
			sortOrder: z.number(),
			createdAt: z.date(),
			updatedAt: z.date(),
			signedUrl: z.string(),
		}),
	),
	amenities: z.array(z.string()),
});

// Generic response schema
export const propertyResponseSchema = z.object({
	success: z.boolean(),
	data: z.any().optional(),
	error: z.string().optional(),
});

// Export types
export type PropertyType = z.infer<typeof propertyTypeEnum>;
export type PropertyStatus = z.infer<typeof propertyStatusEnum>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type AddPropertyImageInput = z.infer<typeof addPropertyImageSchema>;
export type AddPropertyAmenityInput = z.infer<typeof addPropertyAmenitySchema>;
export type RemovePropertyImageInput = z.infer<
	typeof removePropertyImageSchema
>;
export type GetPropertiesInput = z.infer<typeof getPropertiesSchema>;
export type GetPropertyInput = z.infer<typeof getPropertySchema>;
export type Property = z.infer<typeof propertySchema>;
export type PropertyImage = z.infer<typeof propertyImageSchema>;
export type PropertyAmenity = z.infer<typeof propertyAmenitySchema>;
export type PropertyWithDetails = z.infer<typeof propertyWithDetailsSchema>;
export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
