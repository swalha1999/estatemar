import type { BaseEntity } from "./common";

export interface Property extends BaseEntity {
	userId: string;
	organizationId: string | null;
	name: string;
	description: string;
	location: string;
	price: string;
	type: string;
	status: string;
	bedrooms: number | null;
	bathrooms: string | null;
	area: number | null;
	lotSize: number | null;
	yearBuilt: number | null;
	parking: number | null;
}

export interface PropertyImage extends BaseEntity {
	propertyId: string;
	objectKey: string;
	fileName: string;
	mimeType: string;
	fileSize: number;
	isPrimary: boolean;
	sortOrder: number;
	signedUrl?: string;
}

export interface PropertyImageWithUrl extends PropertyImage {
	signedUrl: string;
}

export interface PropertyAmenity {
	id: string;
	propertyId: string;
	name: string;
	createdAt: Date;
}

export interface CreatePropertyData {
	userId: string;
	organizationId?: string | null;
	name: string;
	description: string;
	location: string;
	price: number;
	type: string;
	status: string;
	bedrooms?: number;
	bathrooms?: number;
	area?: number;
	lotSize?: number;
	yearBuilt?: number;
	parking?: number;
}

export interface UpdatePropertyData {
	name?: string;
	description?: string;
	location?: string;
	price?: number;
	type?: string;
	status?: string;
	bedrooms?: number;
	bathrooms?: number;
	area?: number;
	lotSize?: number;
	yearBuilt?: number;
	parking?: number;
}

export interface PropertyFilters {
	organizationId?: string;
	type?: string;
	status?: string;
	minPrice?: number;
	maxPrice?: number;
	bedrooms?: number;
	bathrooms?: number;
}

export interface PropertyWithImages extends Property {
	images: PropertyImageWithUrl[];
}

export interface PropertyWithDetails extends Property {
	images: PropertyImageWithUrl[];
	amenities: string[];
}