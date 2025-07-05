import { BaseRepository } from "./base";
import { properties } from "@/data/access-layer-v2/schemas/property.schema";
import { eq, and, gte, lte, like, desc, asc } from "drizzle-orm";
import { PropertyCreatePayload, PropertyUpdatePayload, PropertySearchParams, propertyInterfaceSelect } from "../interfaces/property.interface";

export class PropertiesRepository extends BaseRepository {
	async create(payload: PropertyCreatePayload & { addedBy?: number }) {
		const [property] = await this.db
			.insert(properties)
			.values({
				...payload,
				price: payload.price.toString(),
				area: payload.area.toString(),
				monthlyRent: payload.monthlyRent?.toString(),
				annualAppreciationRate: payload.annualAppreciationRate?.toString(),
			})
			.returning();
		return property;
	}

	async update(id: number, payload: Partial<PropertyUpdatePayload>) {
		const updateData: any = { ...payload, updatedAt: new Date() };
		
		if (payload.price !== undefined) {
			updateData.price = payload.price.toString();
		}
		if (payload.area !== undefined) {
			updateData.area = payload.area.toString();
		}
		if (payload.monthlyRent !== undefined) {
			updateData.monthlyRent = payload.monthlyRent.toString();
		}
		if (payload.annualAppreciationRate !== undefined) {
			updateData.annualAppreciationRate = payload.annualAppreciationRate.toString();
		}

		const [property] = await this.db
			.update(properties)
			.set(updateData)
			.where(eq(properties.id, id))
			.returning();
		return property;
	}

	async delete(id: number) {
		const [property] = await this.db
			.delete(properties)
			.where(eq(properties.id, id))
			.returning();
		return property;
	}

	async findById(id: number) {
		const [property] = await this.db
			.select(propertyInterfaceSelect)
			.from(properties)
			.where(eq(properties.id, id));
		return property;
	}

	async findAll(params?: PropertySearchParams) {
		const {
			page = '1',
			limit = '10',
			sortBy = 'createdAt',
			sortOrder = 'desc',
			propertyType,
			listingType,
			minPrice,
			maxPrice,
			minBedrooms,
			minBathrooms,
			minArea,
			isAvailable,
			isFeatured,
			location,
		} = params || {};

		const pageNumber = parseInt(page);
		const limitNumber = parseInt(limit);

		const conditions = [];

		if (propertyType) {
			conditions.push(eq(properties.propertyType, propertyType));
		}
		if (listingType) {
			conditions.push(eq(properties.listingType, listingType));
		}
		if (minPrice) {
			conditions.push(gte(properties.price, minPrice.toString()));
		}
		if (maxPrice) {
			conditions.push(lte(properties.price, maxPrice.toString()));
		}
		if (minBedrooms) {
			conditions.push(gte(properties.bedrooms, minBedrooms));
		}
		if (minBathrooms) {
			conditions.push(gte(properties.bathrooms, minBathrooms));
		}
		if (minArea) {
			conditions.push(gte(properties.area, minArea.toString()));
		}
		if (isAvailable !== undefined) {
			conditions.push(eq(properties.isAvailable, isAvailable));
		}
		if (isFeatured !== undefined) {
			conditions.push(eq(properties.isFeatured, isFeatured));
		}
		if (location) {
			conditions.push(like(properties.location, `%${location}%`));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
		
		let orderByClause;
		switch (sortBy) {
			case 'price':
				orderByClause = sortOrder === 'asc' ? asc(properties.price) : desc(properties.price);
				break;
			case 'area':
				orderByClause = sortOrder === 'asc' ? asc(properties.area) : desc(properties.area);
				break;
			case 'bedrooms':
				orderByClause = sortOrder === 'asc' ? asc(properties.bedrooms) : desc(properties.bedrooms);
				break;
			case 'createdAt':
			default:
				orderByClause = sortOrder === 'asc' ? asc(properties.createdAt) : desc(properties.createdAt);
				break;
		}

		const offset = (pageNumber - 1) * limitNumber;

		const [results, totalCount] = await Promise.all([
			this.db
				.select(propertyInterfaceSelect)
				.from(properties)
				.where(whereClause)
				.orderBy(orderByClause)
				.limit(limitNumber)
				.offset(offset),
			this.db
				.select({ count: properties.id })
				.from(properties)
				.where(whereClause)
				.then(result => result.length),
		]);

		return {
			data: results,
			total: totalCount,
			page: pageNumber,
			limit: limitNumber,
			totalPages: Math.ceil(totalCount / limitNumber),
		};
	}

	async toggleAvailability(id: number) {
		const property = await this.findById(id);
		if (!property) return null;
		
		return this.update(id, { isAvailable: !property.isAvailable });
	}

	async toggleFeatured(id: number) {
		const property = await this.findById(id);
		if (!property) return null;
		
		return this.update(id, { isFeatured: !property.isFeatured });
	}
} 