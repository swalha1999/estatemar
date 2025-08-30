import { ForbiddenError, NotFoundError } from "../errors/base";
import { bucket } from "../lib/r2";
import type { PropertyRepository } from "../repositories/interfaces/PropertyRepository";
import type { AuthContext, PaginationParams, ServiceResult } from "../types/common";
import type {
	CreatePropertyData,
	Property,
	PropertyFilters,
	PropertyImageWithUrl,
	PropertyWithDetails,
	PropertyWithImages,
	UpdatePropertyData,
} from "../types/property";
import {
	createErrorResult,
	createSuccessResult,
	handleServiceError,
} from "../utils/result";
import type { AuthorizationService } from "./AuthorizationService";

export class PropertyService {
	constructor(
		private propertyRepo: PropertyRepository,
		private authService: AuthorizationService,
	) {}

	async createProperty(
		data: Omit<CreatePropertyData, "userId">,
		authContext: AuthContext,
	): Promise<ServiceResult<Property>> {
		try {
			// If organizationId is provided, check if user can create properties in org
			if (data.organizationId) {
				await this.authService.canEditOrganizationProperties(
					authContext,
					data.organizationId,
				);
			}

			const propertyData: CreatePropertyData = {
				...data,
				userId: authContext.userId,
			};

			const property = await this.propertyRepo.create(propertyData);
			return createSuccessResult(property);
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async getProperty(
		propertyId: string,
		authContext: AuthContext,
	): Promise<ServiceResult<PropertyWithDetails>> {
		try {
			const property = await this.propertyRepo.findByIdWithDetails(propertyId);
			if (!property) {
				return createErrorResult("Property not found");
			}

			const ownership = await this.propertyRepo.getPropertyOwnership(propertyId);
			if (!ownership) {
				return createErrorResult("Property not found");
			}

			const canView = await this.authService.canViewProperty(
				authContext,
				ownership,
			);
			if (!canView) {
				throw new ForbiddenError("Unauthorized to view this property");
			}

			return createSuccessResult(property);
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async updateProperty(
		propertyId: string,
		data: UpdatePropertyData,
		authContext: AuthContext,
	): Promise<ServiceResult<Property>> {
		try {
			const ownership = await this.propertyRepo.getPropertyOwnership(propertyId);
			if (!ownership) {
				return createErrorResult("Property not found");
			}

			const canEdit = await this.authService.canEditProperty(
				authContext,
				ownership,
			);
			if (!canEdit) {
				throw new ForbiddenError("Unauthorized to edit this property");
			}

			const property = await this.propertyRepo.update(propertyId, data);
			return createSuccessResult(property);
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async getUserProperties(
		filters: PropertyFilters,
		pagination: PaginationParams,
		authContext: AuthContext,
	): Promise<ServiceResult<PropertyWithImages[]>> {
		try {
			let properties: Property[];

			if (filters.organizationId) {
				// Check if user has access to this organization
				await this.authService.canViewOrganizationProperties(
					authContext,
					filters.organizationId,
				);

				properties = await this.propertyRepo.findByOrganization(
					filters.organizationId,
					filters,
					pagination,
				);
			} else {
				// Get user's personal properties
				properties = await this.propertyRepo.findByUser(
					authContext.userId,
					filters,
					pagination,
				);
			}

			// Get primary image for each property
			const propertiesWithImages = await Promise.all(
				properties.map(async (prop) => {
					const details = await this.propertyRepo.findByIdWithDetails(prop.id);
					return {
						...prop,
						images: details?.images.slice(0, 1) || [], // Only primary image
					};
				}),
			);

			return createSuccessResult(propertiesWithImages);
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async addPropertyImage(
		propertyId: string,
		imageData: {
			objectKey: string;
			fileName: string;
			mimeType: string;
			fileSize: number;
			isPrimary: boolean;
			sortOrder: number;
		},
		authContext: AuthContext,
	): Promise<ServiceResult<{ id: string; signedUrl: string }>> {
		try {
			const ownership = await this.propertyRepo.getPropertyOwnership(propertyId);
			if (!ownership) {
				return createErrorResult("Property not found");
			}

			const canEdit = await this.authService.canEditProperty(
				authContext,
				ownership,
			);
			if (!canEdit) {
				throw new ForbiddenError("Unauthorized to edit this property");
			}

			const imageDataWithPropertyId = {
				...imageData,
				propertyId,
			};
			const image = await this.propertyRepo.addImage(propertyId, imageDataWithPropertyId);
			const signedUrl = await bucket.getObjectSignedUrl(image.objectKey, 3600);

			return createSuccessResult({
				id: image.id,
				signedUrl,
			});
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async removePropertyImage(
		imageId: string,
		authContext: AuthContext,
	): Promise<ServiceResult<{ imageId: string }>> {
		try {
			// First get the image to find the property
			const image = await this.propertyRepo.removeImage(imageId);
			if (!image) {
				return createErrorResult("Image not found");
			}

			const ownership = await this.propertyRepo.getPropertyOwnership(
				image.propertyId,
			);
			if (!ownership) {
				return createErrorResult("Property not found");
			}

			const canEdit = await this.authService.canEditProperty(
				authContext,
				ownership,
			);
			if (!canEdit) {
				throw new ForbiddenError("Unauthorized to edit this property");
			}

			// Delete the file from R2 storage
			try {
				await bucket.deleteObject(image.objectKey);
			} catch (storageError) {
				console.warn("Failed to delete file from storage:", storageError);
			}

			return createSuccessResult({ imageId });
		} catch (error) {
			return handleServiceError(error);
		}
	}

	async addPropertyAmenity(
		propertyId: string,
		amenityName: string,
		authContext: AuthContext,
	): Promise<ServiceResult<{ message: string }>> {
		try {
			const ownership = await this.propertyRepo.getPropertyOwnership(propertyId);
			if (!ownership) {
				return createErrorResult("Property not found");
			}

			const canEdit = await this.authService.canEditProperty(
				authContext,
				ownership,
			);
			if (!canEdit) {
				throw new ForbiddenError("Unauthorized to edit this property");
			}

			await this.propertyRepo.addAmenity(propertyId, amenityName);
			return createSuccessResult({ message: "Amenity added successfully" });
		} catch (error) {
			return handleServiceError(error);
		}
	}
}