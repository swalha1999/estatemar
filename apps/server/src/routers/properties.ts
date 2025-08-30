import {
	addPropertyAmenitySchema,
	addPropertyImageSchema,
	createPropertySchema,
	getPropertiesSchema,
	getPropertySchema,
	removePropertyImageSchema,
	updatePropertySchema,
} from "@estatemar/schemas/properties";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import { organizationMember } from "../db/schema/organizations";
import {
	property,
	propertyAmenity,
	propertyImage,
} from "../db/schema/property";
import { protectedProcedure } from "../lib/orpc";
import { bucket } from "../lib/r2";

// Helper function to check if user has access to organization
async function hasOrgAccess(
	userId: string,
	orgId: string,
	requiredRoles: string[] = ["owner", "admin", "member", "viewer"],
): Promise<boolean> {
	const membership = await db
		.select()
		.from(organizationMember)
		.where(
			and(
				eq(organizationMember.userId, userId),
				eq(organizationMember.organizationId, orgId),
			),
		)
		.limit(1);

	return membership.length > 0 && requiredRoles.includes(membership[0].role);
}

// Helper function to check if user can edit properties in organization
async function canEditOrgProperties(
	userId: string,
	orgId: string,
): Promise<boolean> {
	return hasOrgAccess(userId, orgId, ["owner", "admin", "member"]);
}

export const propertiesRouter = {
	createProperty: protectedProcedure
		.input(createPropertySchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// If organizationId is provided, check if user can create properties in org
				if (input.organizationId) {
					const canEdit = await canEditOrgProperties(
						userId,
						input.organizationId,
					);
					if (!canEdit) {
						return {
							success: false,
							error:
								"Insufficient permissions to create properties in this organization",
						};
					}
				}

				const propertyId = crypto.randomUUID();

				const newProperty = await db
					.insert(property)
					.values({
						id: propertyId,
						userId: input.organizationId ? null : userId, // Set userId only if not org property
						organizationId: input.organizationId || null,
						name: input.name,
						description: input.description,
						location: input.location,
						price: input.price.toString(),
						type: input.type,
						status: input.status,
						bedrooms: input.bedrooms,
						bathrooms: input.bathrooms ? input.bathrooms.toString() : undefined,
						area: input.area,
						lotSize: input.lotSize,
						yearBuilt: input.yearBuilt,
						parking: input.parking,
					})
					.returning();

				return {
					success: true,
					data: newProperty[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to create property",
				};
			}
		}),

	addPropertyImage: protectedProcedure
		.input(addPropertyImageSchema)
		.handler(async ({ input }) => {
			try {
				const imageId = crypto.randomUUID();

				// First, if this is the primary image, unset other primary images for this property
				if (input.isPrimary) {
					await db
						.update(propertyImage)
						.set({ isPrimary: false })
						.where(eq(propertyImage.propertyId, input.propertyId));
				}

				const newImage = await db
					.insert(propertyImage)
					.values({
						id: imageId,
						...input,
					})
					.returning();

				return {
					success: true,
					data: newImage[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to add property image",
				};
			}
		}),

	addPropertyAmenity: protectedProcedure
		.input(addPropertyAmenitySchema)
		.handler(async ({ input }) => {
			try {
				const amenityId = crypto.randomUUID();

				const newAmenity = await db
					.insert(propertyAmenity)
					.values({
						id: amenityId,
						...input,
					})
					.returning();

				return {
					success: true,
					data: newAmenity[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to add property amenity",
				};
			}
		}),

	updateProperty: protectedProcedure
		.input(updatePropertySchema)
		.handler(async ({ input, context }) => {
			try {
				const { id, ...updateData } = input;

				// First check if the property exists and user owns it
				const existingProperty = await db
					.select()
					.from(property)
					.where(eq(property.id, id))
					.limit(1);

				if (existingProperty.length === 0) {
					return {
						success: false,
						error: "Property not found",
					};
				}

				const userId = context.session?.user?.id;
				let canEdit = false;

				if (existingProperty[0].userId === userId) {
					// User owns the property directly
					canEdit = true;
				} else if (existingProperty[0].organizationId && userId) {
					// Property belongs to organization - check if user can edit
					canEdit = await canEditOrgProperties(
						userId,
						existingProperty[0].organizationId,
					);
				}

				if (!canEdit) {
					return {
						success: false,
						error: "Unauthorized",
					};
				}

				// Prepare update data
				const updateValues: Record<string, unknown> = {
					updatedAt: new Date(),
				};

				if (updateData.name !== undefined) updateValues.name = updateData.name;
				if (updateData.description !== undefined)
					updateValues.description = updateData.description;
				if (updateData.location !== undefined)
					updateValues.location = updateData.location;
				if (updateData.price !== undefined)
					updateValues.price = updateData.price.toString();
				if (updateData.type !== undefined) updateValues.type = updateData.type;
				if (updateData.status !== undefined)
					updateValues.status = updateData.status;
				if (updateData.bedrooms !== undefined)
					updateValues.bedrooms = updateData.bedrooms;
				if (updateData.bathrooms !== undefined)
					updateValues.bathrooms = updateData.bathrooms?.toString();
				if (updateData.area !== undefined) updateValues.area = updateData.area;
				if (updateData.lotSize !== undefined)
					updateValues.lotSize = updateData.lotSize;
				if (updateData.yearBuilt !== undefined)
					updateValues.yearBuilt = updateData.yearBuilt;
				if (updateData.parking !== undefined)
					updateValues.parking = updateData.parking;

				const updatedProperty = await db
					.update(property)
					.set(updateValues)
					.where(eq(property.id, id))
					.returning();

				return {
					success: true,
					data: updatedProperty[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to update property",
				};
			}
		}),

	removePropertyImage: protectedProcedure
		.input(removePropertyImageSchema)
		.handler(async ({ input, context }) => {
			try {
				// First check if the image exists and user owns the property
				const existingImage = await db
					.select()
					.from(propertyImage)
					.where(eq(propertyImage.id, input.imageId))
					.limit(1);

				if (existingImage.length === 0) {
					return {
						success: false,
						error: "Image not found",
					};
				}

				// Check if user owns the property
				const propertyData = await db
					.select()
					.from(property)
					.where(eq(property.id, existingImage[0].propertyId))
					.limit(1);

				if (
					propertyData.length === 0 ||
					propertyData[0].userId !== context.session?.user?.id
				) {
					return {
						success: false,
						error: "Unauthorized",
					};
				}

				// Delete the image record
				await db
					.delete(propertyImage)
					.where(eq(propertyImage.id, input.imageId));

				// Optionally delete the file from R2 storage
				try {
					await bucket.deleteObject(existingImage[0].objectKey);
				} catch (storageError) {
					console.warn("Failed to delete file from storage:", storageError);
					// Don't fail the operation if storage deletion fails
				}

				return {
					success: true,
					data: { imageId: input.imageId },
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to remove property image",
				};
			}
		}),

	getUserProperties: protectedProcedure
		.input(getPropertiesSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				let whereCondition: ReturnType<typeof eq> | ReturnType<typeof and>;

				if (input.organizationId) {
					// Check if user has access to this organization
					const hasAccess = await hasOrgAccess(userId, input.organizationId);
					if (!hasAccess) {
						return { success: false, error: "Access denied to organization" };
					}

					// Get organization properties
					whereCondition = eq(property.organizationId, input.organizationId);
				} else {
					// Get user's personal properties (where organizationId is null)
					whereCondition = and(
						eq(property.userId, userId),
						isNull(property.organizationId),
					);
				}

				const properties = await db
					.select()
					.from(property)
					.where(whereCondition)
					.limit(input.limit)
					.offset(input.offset);

				// Get images for each property
				const propertiesWithImages = await Promise.all(
					properties.map(async (prop) => {
						const images = await db
							.select()
							.from(propertyImage)
							.where(eq(propertyImage.propertyId, prop.id))
							.orderBy(propertyImage.sortOrder)
							.limit(1); // Only get the primary image for listing

						// Add signed URLs to images (expires in 1 hour)
						const imagesWithUrls = await Promise.all(
							images.map(async (image) => ({
								...image,
								signedUrl: await bucket.getObjectSignedUrl(
									image.objectKey,
									3600,
								), // 1 hour
							})),
						);

						return {
							...prop,
							images: imagesWithUrls,
						};
					}),
				);

				return {
					success: true,
					data: propertiesWithImages,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch properties",
				};
			}
		}),

	getProperty: protectedProcedure
		.input(getPropertySchema)
		.handler(async ({ input, context }) => {
			try {
				console.log("Server: Raw input received:", input);
				console.log("Server: Input type:", typeof input);
				console.log("Server: Fetching property with ID:", input.id);
				console.log("Server: ID type:", typeof input.id);
				console.log("Server: User ID from session:", context.session?.user?.id);

				const propertyData = await db
					.select()
					.from(property)
					.where(eq(property.id, input.id))
					.limit(1);

				console.log(
					"Server: Property data found:",
					propertyData.length > 0 ? "YES" : "NO",
				);
				if (propertyData.length > 0) {
					console.log("Server: Property userId:", propertyData[0].userId);
				}

				if (propertyData.length === 0) {
					return {
						success: false,
						error: "Property not found",
					};
				}

				const prop = propertyData[0];

				// Check if user has access to this property
				const userId = context.session?.user?.id;
				let hasAccess = false;

				if (prop.userId === userId) {
					// User owns the property directly
					hasAccess = true;
				} else if (prop.organizationId && userId) {
					// Property belongs to organization - check if user is member
					hasAccess = await hasOrgAccess(userId, prop.organizationId);
				}

				if (!hasAccess) {
					return {
						success: false,
						error: "Unauthorized",
					};
				}

				// Get images for this property
				const images = await db
					.select()
					.from(propertyImage)
					.where(eq(propertyImage.propertyId, input.id))
					.orderBy(propertyImage.sortOrder);

				// Add signed URLs to images (expires in 1 hour)
				const imagesWithUrls = await Promise.all(
					images.map(async (image) => ({
						...image,
						signedUrl: await bucket.getObjectSignedUrl(image.objectKey, 3600), // 1 hour
					})),
				);

				// Get amenities for this property
				const amenities = await db
					.select()
					.from(propertyAmenity)
					.where(eq(propertyAmenity.propertyId, input.id));

				return {
					success: true,
					data: {
						...prop,
						images: imagesWithUrls,
						amenities: amenities.map((a) => a.name),
					},
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error ? error.message : "Failed to fetch property",
				};
			}
		}),
};
