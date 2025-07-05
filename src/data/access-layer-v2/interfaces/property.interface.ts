import { properties, Property } from "@/data/access-layer-v2/schemas/property.schema";
import { BaseSearchParams } from "./base.interface";
import { z } from 'zod';

// Re-export the Property type from schema
export type { Property } from "@/data/access-layer-v2/schemas/property.schema";

/**
 * Interface for the property table
 * @description This interface is used to define the structure of the property table
 * @returns {Object} The interface for the property table with the following fields:
 */
export const propertyInterfaceSelect = {
    id: properties.id,
    title: properties.title,
    description: properties.description,
    price: properties.price,
    location: properties.location,
    address: properties.address,
    bedrooms: properties.bedrooms,
    bathrooms: properties.bathrooms,
    area: properties.area,
    propertyType: properties.propertyType,
    listingType: properties.listingType,
    isAvailable: properties.isAvailable,
    isFeatured: properties.isFeatured,
    amenities: properties.amenities,
    latitude: properties.latitude,
    longitude: properties.longitude,
    yearBuilt: properties.yearBuilt,
    parkingSpaces: properties.parkingSpaces,
    agentName: properties.agentName,
    agentPhone: properties.agentPhone,
    agentEmail: properties.agentEmail,
    virtualTourUrl: properties.virtualTourUrl,
    monthlyRent: properties.monthlyRent,
    annualAppreciationRate: properties.annualAppreciationRate,
    createdAt: properties.createdAt,
    updatedAt: properties.updatedAt,
    addedBy: properties.addedBy,
}

export const propertyFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	price: z.string().min(1, 'Price is required'),
	location: z.string().min(1, 'Location is required'),
	address: z.string().min(1, 'Address is required'),
	bedrooms: z.number().min(0),
	bathrooms: z.number().min(0),
	area: z.string().min(1, 'Area is required'),
	propertyType: z.enum(['villa', 'apartment', 'house', 'commercial', 'land', 'other']),
	listingType: z.enum(['sale', 'rent', 'both']),
	isAvailable: z.boolean(),
	isFeatured: z.boolean(),
	amenities: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	yearBuilt: z.number().optional(),
	parkingSpaces: z.number().min(0),
	agentName: z.string().optional(),
	agentPhone: z.string().optional(),
	agentEmail: z.string().email().optional().or(z.literal('')),
	virtualTourUrl: z.string().url().optional().or(z.literal('')),
	monthlyRent: z.string().optional(),
	annualAppreciationRate: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

export interface PropertyWithImages extends Property {
	images?: Array<{
		id: number;
		fileName: string;
		url: string;
		isPrimary: boolean;
		displayOrder: number;
	}>;
}

export interface PropertyCreatePayload {
    title: string;
    description: string;
    price: string | number;
    location: string;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: string | number;
    propertyType: 'villa' | 'apartment' | 'house' | 'commercial' | 'land' | 'other';
    listingType: 'sale' | 'rent' | 'both';
    isAvailable?: boolean;
    isFeatured?: boolean;
    amenities?: string[];
    latitude?: number;
    longitude?: number;
    yearBuilt?: number;
    parkingSpaces?: number;
    agentName?: string;
    agentPhone?: string;
    agentEmail?: string;
    virtualTourUrl?: string;
    monthlyRent?: string | number;
    annualAppreciationRate?: string | number;
}

export interface PropertyUpdatePayload extends Partial<PropertyCreatePayload> {
    id: number;
}

export interface PropertySearchParams extends BaseSearchParams {
    propertyType?: 'villa' | 'apartment' | 'house' | 'commercial' | 'land' | 'other';
    listingType?: 'sale' | 'rent' | 'both';
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    minBathrooms?: number;
    minArea?: number;
    isAvailable?: boolean;
    isFeatured?: boolean;
    location?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
} 