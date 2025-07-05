'use server';

import { PropertiesService } from '@/data/access-layer-v2/services';
import { PropertyCreatePayload, PropertyUpdatePayload } from '@/data/access-layer-v2/interfaces/property.interface';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from 'next/navigation';
import { FilesService } from '@/data/access-layer-v2/services';

export async function createProperty(payload: PropertyCreatePayload, fileIds: number[]) {
	try {
		const { user } = await getCurrentSession();
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		
		// Validate the property data
		await propertiesService.validatePropertyData(payload);
		
		// Create the property
		const property = await propertiesService.createProperty(payload);
		
		// Add images to the property
		if (fileIds.length > 0) {
			for (let i = 0; i < fileIds.length; i++) {
				await propertiesService.addImageToProperty(
					property.id,
					fileIds[i],
					i === 0, // First image is primary
					i // Display order
				);
			}
		}
		
		return { success: true, property };
	} catch (error) {
		console.error('Error creating property:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function updateProperty(id: number, payload: Partial<PropertyUpdatePayload>) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		
		// Validate the property data
		await propertiesService.validatePropertyData(payload);
		
		// Update the property
		const property = await propertiesService.updateProperty(id, payload);
		
		return { success: true, property };
	} catch (error) {
		console.error('Error updating property:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function deleteProperty(id: number) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		await propertiesService.deleteProperty(id);
		
		return { success: true };
	} catch (error) {
		console.error('Error deleting property:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function togglePropertyAvailability(id: number) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		const property = await propertiesService.togglePropertyAvailability(id);
		
		return { success: true, property };
	} catch (error) {
		console.error('Error toggling property availability:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function togglePropertyFeatured(id: number) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		const property = await propertiesService.togglePropertyFeatured(id);
		
		return { success: true, property };
	} catch (error) {
		console.error('Error toggling property featured status:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function addPropertyImage(propertyId: number, fileId: number, isPrimary: boolean = false, displayOrder: number = 0) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		const result = await propertiesService.addImageToProperty(propertyId, fileId, isPrimary, displayOrder);
		
		return { success: true, result };
	} catch (error) {
		console.error('Error adding image to property:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function removePropertyImage(propertyId: number, fileId: number) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		await propertiesService.removeImageFromProperty(propertyId, fileId);
		
		return { success: true };
	} catch (error) {
		console.error('Error removing image from property:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function setPrimaryPropertyImage(propertyId: number, fileId: number) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const propertiesService = new PropertiesService();
		await propertiesService.setPrimaryImage(propertyId, fileId);
		
		return { success: true };
	} catch (error) {
		console.error('Error setting primary image:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
}

export async function saveUploadedFile(fileName: string) {
	try {
		const { user } = await getCurrentSession();
		
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			redirect('/login');
		}

		const filesService = new FilesService();
		const file = await filesService.createFile(fileName);
		
		if (!file) {
			throw new Error('File creation returned null or undefined');
		}
		
		if (!('id' in file) || typeof file.id !== 'number') {
			throw new Error(`File object missing id property or id is not a number. File: ${JSON.stringify(file)}`);
		}
		
		return { success: true, fileId: file.id };
	} catch (error) {
		console.error('Error saving file:', error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : 'An unexpected error occurred' 
		};
	}
} 