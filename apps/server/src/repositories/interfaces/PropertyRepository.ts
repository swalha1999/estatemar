import type { PaginationParams } from "../../types/common";
import type {
	CreatePropertyData,
	Property,
	PropertyFilters,
	PropertyImage,
	PropertyImageWithUrl,
	PropertyWithDetails,
	UpdatePropertyData,
} from "../../types/property";

export interface PropertyRepository {
	create(data: CreatePropertyData): Promise<Property>;
	findById(id: string): Promise<Property | null>;
	findByIdWithDetails(id: string): Promise<PropertyWithDetails | null>;
	findByUser(
		userId: string,
		filters: PropertyFilters,
		pagination: PaginationParams,
	): Promise<Property[]>;
	findByOrganization(
		organizationId: string,
		filters: PropertyFilters,
		pagination: PaginationParams,
	): Promise<Property[]>;
	update(id: string, data: UpdatePropertyData): Promise<Property>;
	delete(id: string): Promise<void>;
	addImage(
		propertyId: string,
		imageData: Omit<PropertyImage, "id" | "createdAt" | "updatedAt">,
	): Promise<PropertyImage>;
	removeImage(imageId: string): Promise<PropertyImage | null>;
	addAmenity(propertyId: string, amenityName: string): Promise<void>;
	getPropertyOwnership(propertyId: string): Promise<{
		userId: string;
		organizationId: string | null;
	} | null>;
}