import { and, eq, isNull } from "drizzle-orm";
import { db } from "../db";
import {
	property,
	propertyAmenity,
	propertyImage,
} from "../db/schema/property";
import { NotFoundError } from "../errors/base";
import type { PaginationParams } from "../types/common";
import type {
	CreatePropertyData,
	Property,
	PropertyFilters,
	PropertyImage,
	PropertyImageWithUrl,
	PropertyWithDetails,
	UpdatePropertyData,
} from "../types/property";
import { bucket } from "../lib/r2";
import type { PropertyRepository } from "./interfaces/PropertyRepository";

export class DrizzlePropertyRepository implements PropertyRepository {
	async create(data: CreatePropertyData): Promise<Property> {
		const propertyId = crypto.randomUUID();

		const result = await db
			.insert(property)
			.values({
				id: propertyId,
				userId: data.userId,
				organizationId: data.organizationId || null,
				name: data.name,
				description: data.description,
				location: data.location,
				price: data.price.toString(),
				type: data.type,
				status: data.status,
				bedrooms: data.bedrooms,
				bathrooms: data.bathrooms?.toString(),
				area: data.area,
				lotSize: data.lotSize,
				yearBuilt: data.yearBuilt,
				parking: data.parking,
			})
			.returning();

		return result[0] as Property;
	}

	async findById(id: string): Promise<Property | null> {
		const result = await db
			.select()
			.from(property)
			.where(eq(property.id, id))
			.limit(1);

		return result.length > 0 ? (result[0] as Property) : null;
	}

	async findByIdWithDetails(id: string): Promise<PropertyWithDetails | null> {
		const propertyResult = await this.findById(id);
		if (!propertyResult) return null;

		const images = await db
			.select()
			.from(propertyImage)
			.where(eq(propertyImage.propertyId, id))
			.orderBy(propertyImage.sortOrder);

		const imagesWithUrls: PropertyImageWithUrl[] = await Promise.all(
			images.map(async (image) => ({
				...image,
				signedUrl: await bucket.getObjectSignedUrl(image.objectKey, 3600),
			} as PropertyImageWithUrl)),
		);

		const amenities = await db
			.select()
			.from(propertyAmenity)
			.where(eq(propertyAmenity.propertyId, id));

		return {
			...propertyResult,
			images: imagesWithUrls,
			amenities: amenities.map((a) => a.name),
		};
	}

	async findByUser(
		userId: string,
		filters: PropertyFilters,
		pagination: PaginationParams,
	): Promise<Property[]> {
		let whereConditions = [
			eq(property.userId, userId),
			filters.organizationId
				? eq(property.organizationId, filters.organizationId)
				: isNull(property.organizationId),
		];

		if (filters.type) {
			whereConditions.push(eq(property.type, filters.type));
		}
		if (filters.status) {
			whereConditions.push(eq(property.status, filters.status));
		}

		const whereCondition = and(...whereConditions);

		const result = await db
			.select()
			.from(property)
			.where(whereCondition)
			.limit(pagination.limit)
			.offset(pagination.offset);

		return result as Property[];
	}

	async findByOrganization(
		organizationId: string,
		filters: PropertyFilters,
		pagination: PaginationParams,
	): Promise<Property[]> {
		let whereConditions = [eq(property.organizationId, organizationId)];

		if (filters.type) {
			whereConditions.push(eq(property.type, filters.type));
		}
		if (filters.status) {
			whereConditions.push(eq(property.status, filters.status));
		}

		const whereCondition = and(...whereConditions);

		const result = await db
			.select()
			.from(property)
			.where(whereCondition)
			.limit(pagination.limit)
			.offset(pagination.offset);

		return result as Property[];
	}

	async update(id: string, data: UpdatePropertyData): Promise<Property> {
		const updateValues: Record<string, unknown> = {
			updatedAt: new Date(),
		};

		Object.entries(data).forEach(([key, value]) => {
			if (value !== undefined) {
				if (key === "price" && typeof value === "number") {
					updateValues[key] = value.toString();
				} else if (key === "bathrooms" && typeof value === "number") {
					updateValues[key] = value.toString();
				} else {
					updateValues[key] = value;
				}
			}
		});

		const result = await db
			.update(property)
			.set(updateValues)
			.where(eq(property.id, id))
			.returning();

		if (result.length === 0) {
			throw new NotFoundError("Property not found");
		}

		return result[0] as Property;
	}

	async delete(id: string): Promise<void> {
		const result = await db.delete(property).where(eq(property.id, id));
		if (result.rowCount === 0) {
			throw new NotFoundError("Property not found");
		}
	}

	async addImage(
		propertyId: string,
		imageData: Omit<PropertyImage, "id" | "createdAt" | "updatedAt">,
	): Promise<PropertyImage> {
		const imageId = crypto.randomUUID();

		if (imageData.isPrimary) {
			await db
				.update(propertyImage)
				.set({ isPrimary: false })
				.where(eq(propertyImage.propertyId, propertyId));
		}

		const result = await db
			.insert(propertyImage)
			.values({
				id: imageId,
				...imageData,
			})
			.returning();

		return result[0] as PropertyImage;
	}

	async removeImage(imageId: string): Promise<PropertyImage | null> {
		const result = await db
			.delete(propertyImage)
			.where(eq(propertyImage.id, imageId))
			.returning();

		return result.length > 0 ? (result[0] as PropertyImage) : null;
	}

	async addAmenity(propertyId: string, amenityName: string): Promise<void> {
		const amenityId = crypto.randomUUID();
		await db.insert(propertyAmenity).values({
			id: amenityId,
			propertyId,
			name: amenityName,
		});
	}

	async getPropertyOwnership(propertyId: string): Promise<{
		userId: string;
		organizationId: string | null;
	} | null> {
		const result = await db
			.select({
				userId: property.userId,
				organizationId: property.organizationId,
			})
			.from(property)
			.where(eq(property.id, propertyId))
			.limit(1);

		if (result.length === 0 || !result[0].userId) {
			return null;
		}

		return {
			userId: result[0].userId,
			organizationId: result[0].organizationId,
		};
	}
}