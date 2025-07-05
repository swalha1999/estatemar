import { BaseService } from "./base.service";
import { PropertiesRepository } from "../repositories/properties.repository";
import { PropertiesFilesRepository } from "../repositories/properties-files.repository";
import { PropertyCreatePayload, PropertyUpdatePayload, PropertySearchParams } from "../interfaces/property.interface";
import { getCurrentSession } from "@/core/auth/session";

export class PropertiesService extends BaseService {
	private propertiesRepository: PropertiesRepository;
	private propertiesFilesRepository: PropertiesFilesRepository;

	constructor() {
		super();
		this.propertiesRepository = new PropertiesRepository();
		this.propertiesFilesRepository = new PropertiesFilesRepository();
	}

	async createProperty(payload: PropertyCreatePayload) {
		const { user } = await getCurrentSession();
		if (!user) {
			throw new Error("User not authenticated");
		}

		return this.propertiesRepository.create({
			...payload,
			addedBy: user.id,
		});
	}

	async updateProperty(id: number, payload: Partial<PropertyUpdatePayload>) {
		const property = await this.propertiesRepository.findById(id);
		if (!property) {
			throw new Error("Property not found");
		}

		return this.propertiesRepository.update(id, payload);
	}

	async deleteProperty(id: number) {
		const property = await this.propertiesRepository.findById(id);
		if (!property) {
			throw new Error("Property not found");
		}

		// Delete all associated files first
		await this.propertiesFilesRepository.deleteAllPropertyFiles(id);

		return this.propertiesRepository.delete(id);
	}

	async getPropertyById(id: number) {
		const property = await this.propertiesRepository.findById(id);
		if (!property) {
			throw new Error("Property not found");
		}

		return property;
	}

	async getPropertyWithImages(id: number) {
		const property = await this.getPropertyById(id);
		const images = await this.propertiesFilesRepository.getPropertyFiles(id);
		
		return {
			...property,
			images,
		};
	}

	async getAllProperties(params?: PropertySearchParams) {
		return this.propertiesRepository.findAll(params);
	}

	async togglePropertyAvailability(id: number) {
		const property = await this.propertiesRepository.toggleAvailability(id);
		if (!property) {
			throw new Error("Property not found");
		}

		return property;
	}

	async togglePropertyFeatured(id: number) {
		const property = await this.propertiesRepository.toggleFeatured(id);
		if (!property) {
			throw new Error("Property not found");
		}

		return property;
	}

	// Image management methods
	async addImageToProperty(propertyId: number, fileId: number, isPrimary: boolean = false, displayOrder: number = 0) {
		const property = await this.propertiesRepository.findById(propertyId);
		if (!property) {
			throw new Error("Property not found");
		}

		return this.propertiesFilesRepository.addFileToProperty(propertyId, fileId, isPrimary, displayOrder);
	}

	async removeImageFromProperty(propertyId: number, fileId: number) {
		return this.propertiesFilesRepository.removeFileFromProperty(propertyId, fileId);
	}

	async setPrimaryImage(propertyId: number, fileId: number) {
		return this.propertiesFilesRepository.setPrimaryImage(propertyId, fileId);
	}

	async updateImageOrder(propertyId: number, fileId: number, displayOrder: number) {
		return this.propertiesFilesRepository.updateFileOrder(propertyId, fileId, displayOrder);
	}

	async getPropertyImages(propertyId: number) {
		return this.propertiesFilesRepository.getPropertyFiles(propertyId);
	}

	async validatePropertyData(payload: PropertyCreatePayload | Partial<PropertyUpdatePayload>) {
		const errors: string[] = [];

		if ('title' in payload && (!payload.title || payload.title.trim().length === 0)) {
			errors.push("Title is required");
		}

		if ('description' in payload && (!payload.description || payload.description.trim().length === 0)) {
			errors.push("Description is required");
		}

		if ('price' in payload && payload.price !== undefined) {
			const price = Number(payload.price);
			if (isNaN(price) || price <= 0) {
				errors.push("Price must be a positive number");
			}
		}

		if ('bedrooms' in payload && payload.bedrooms !== undefined) {
			if (payload.bedrooms < 0) {
				errors.push("Bedrooms must be a positive number");
			}
		}

		if ('bathrooms' in payload && payload.bathrooms !== undefined) {
			if (payload.bathrooms < 0) {
				errors.push("Bathrooms must be a positive number");
			}
		}

		if ('area' in payload && payload.area !== undefined) {
			const area = Number(payload.area);
			if (isNaN(area) || area <= 0) {
				errors.push("Area must be a positive number");
			}
		}

		if ('yearBuilt' in payload && payload.yearBuilt !== undefined) {
			const currentYear = new Date().getFullYear();
			if (payload.yearBuilt < 1800 || payload.yearBuilt > currentYear + 5) {
				errors.push("Year built must be between 1800 and " + (currentYear + 5));
			}
		}

		if ('agentEmail' in payload && payload.agentEmail) {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(payload.agentEmail)) {
				errors.push("Invalid agent email format");
			}
		}

		if (errors.length > 0) {
			throw new Error(errors.join(", "));
		}

		return true;
	}
} 