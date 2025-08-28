import {
	addPropertyAmenitySchema,
	addPropertyImageSchema,
	createPropertySchema,
	getPropertiesSchema,
	getPropertySchema,
	removePropertyImageSchema,
	updatePropertySchema,
} from "@estatemar/schemas/properties";
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
	property,
	propertyAmenity,
	propertyImage,
} from "../db/schema/property";
import { protectedProcedure } from "../lib/orpc";
import { bucket } from "../lib/r2";

export const propertiesRouter = {
	createProperty: protectedProcedure
		.input(createPropertySchema)
		.handler(async ({ input, context }) => {
			try {
				const propertyId = crypto.randomUUID();

				const newProperty = await db
					.insert(property)
					.values({
						id: propertyId,
						userId: context.session?.user?.id || "",
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

				if (existingProperty[0].userId !== context.session?.user?.id) {
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
				const properties = await db
					.select()
					.from(property)
					.where(eq(property.userId, context.session?.user?.id || ""))
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

				// Check if user owns this property
				console.log("Server: Property userId:", prop.userId);
				console.log("Server: Session userId:", context.session?.user?.id);
				if (prop.userId !== context.session?.user?.id) {
					console.log("Server: User does not own this property");
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
