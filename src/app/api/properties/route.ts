import { NextRequest, NextResponse } from 'next/server';
import { PropertiesService } from '@/data/access-layer-v2/services';
import { getCurrentSession } from '@/core/auth/session';
import { getSignedUrlForDownload } from '@/lib/storage/r2';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = searchParams.get('page') || '1';
		const limit = searchParams.get('limit') || '10';
		const propertyType = searchParams.get('propertyType');
		const listingType = searchParams.get('listingType');
		const minPrice = searchParams.get('minPrice');
		const maxPrice = searchParams.get('maxPrice');
		const minBedrooms = searchParams.get('minBedrooms');
		const minBathrooms = searchParams.get('minBathrooms');
		const minArea = searchParams.get('minArea');
		const isAvailable = searchParams.get('isAvailable');
		const isFeatured = searchParams.get('isFeatured');
		const location = searchParams.get('location');
		const sortBy = searchParams.get('sortBy') || 'createdAt';
		const sortOrder = searchParams.get('sortOrder') || 'desc';

		const propertiesService = new PropertiesService();
		
		const params = {
			page,
			limit,
			propertyType: propertyType as any,
			listingType: listingType as any,
			minPrice: minPrice ? parseInt(minPrice) : undefined,
			maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
			minBedrooms: minBedrooms ? parseInt(minBedrooms) : undefined,
			minBathrooms: minBathrooms ? parseInt(minBathrooms) : undefined,
			minArea: minArea ? parseInt(minArea) : undefined,
			isAvailable: isAvailable ? isAvailable === 'true' : undefined,
			isFeatured: isFeatured ? isFeatured === 'true' : undefined,
			location: location || undefined,
			sortBy,
			sortOrder: sortOrder as 'asc' | 'desc',
		};

		const result = await propertiesService.getAllProperties(params);

		// Transform the data to match the exact format specified
		const transformedProperties = await Promise.all(
			result.data.map(async (property) => {
				// Get images for this property
				const images = await propertiesService.getPropertyImages(property.id);
				
				// Transform to match the API specification format
				return {
					id: property.id.toString(),
					title: property.title,
					description: property.description,
					price: parseFloat(property.price),
					location: property.location,
					address: property.address,
					bedrooms: property.bedrooms,
					bathrooms: property.bathrooms,
					area: parseFloat(property.area),
					imageUrls: images.map(img => {
						return getSignedUrlForDownload(img.fileName);
					}),
					propertyType: property.propertyType,
					listingType: property.listingType,
					isAvailable: property.isAvailable,
					isFeatured: property.isFeatured,
					amenities: property.amenities || [],
					latitude: property.latitude,
					longitude: property.longitude,
					yearBuilt: property.yearBuilt,
					parkingSpaces: property.parkingSpaces || 0,
					agentName: property.agentName,
					agentPhone: property.agentPhone,
					agentEmail: property.agentEmail,
					createdAt: property.createdAt,
					updatedAt: property.updatedAt,
					virtualTourUrl: property.virtualTourUrl,
					monthlyRent: property.monthlyRent ? parseFloat(property.monthlyRent) : null,
					annualAppreciationRate: property.annualAppreciationRate ? parseFloat(property.annualAppreciationRate) : null,
				};
			})
		);

		return NextResponse.json({
			success: true,
			data: transformedProperties,
			pagination: {
				page: result.page,
				limit: result.limit,
				total: result.total,
				totalPages: result.totalPages,
			},
		});
	} catch (error) {
		console.error('Error fetching properties:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : 'An unexpected error occurred' 
			},
			{ status: 500 }
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const { user } = await getCurrentSession();
		if (!user || (!user.is_super_admin && !user.is_developer)) {
			return NextResponse.json(
				{ success: false, error: 'Unauthorized' },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { fileIds, ...propertyData } = body;

		const propertiesService = new PropertiesService();
		
		// Validate the property data
		await propertiesService.validatePropertyData(propertyData);
		
		// Create the property
		const property = await propertiesService.createProperty(propertyData);
		
		// Add images to the property
		if (fileIds && fileIds.length > 0) {
			for (let i = 0; i < fileIds.length; i++) {
				await propertiesService.addImageToProperty(
					property.id,
					fileIds[i],
					i === 0, // First image is primary
					i // Display order
				);
			}
		}

		// Get the created property with images
		const propertyWithImages = await propertiesService.getPropertyWithImages(property.id);

		// Transform to match the API specification format
		const transformedProperty = {
			id: propertyWithImages.id.toString(),
			title: propertyWithImages.title,
			description: propertyWithImages.description,
			price: parseFloat(propertyWithImages.price),
			location: propertyWithImages.location,
			address: propertyWithImages.address,
			bedrooms: propertyWithImages.bedrooms,
			bathrooms: propertyWithImages.bathrooms,
			area: parseFloat(propertyWithImages.area),
			imageUrls: propertyWithImages.images.map(img => {
				return `https://estatemar.d97515014e92cd4f04045d814b2679c4.r2.cloudflarestorage.com/${img.fileName}`;
			}),
			propertyType: propertyWithImages.propertyType,
			listingType: propertyWithImages.listingType,
			isAvailable: propertyWithImages.isAvailable,
			isFeatured: propertyWithImages.isFeatured,
			amenities: propertyWithImages.amenities || [],
			latitude: propertyWithImages.latitude,
			longitude: propertyWithImages.longitude,
			yearBuilt: propertyWithImages.yearBuilt,
			parkingSpaces: propertyWithImages.parkingSpaces || 0,
			agentName: propertyWithImages.agentName,
			agentPhone: propertyWithImages.agentPhone,
			agentEmail: propertyWithImages.agentEmail,
			createdAt: propertyWithImages.createdAt,
			updatedAt: propertyWithImages.updatedAt,
			virtualTourUrl: propertyWithImages.virtualTourUrl,
			monthlyRent: propertyWithImages.monthlyRent ? parseFloat(propertyWithImages.monthlyRent) : null,
			annualAppreciationRate: propertyWithImages.annualAppreciationRate ? parseFloat(propertyWithImages.annualAppreciationRate) : null,
		};

		return NextResponse.json({
			success: true,
			data: transformedProperty,
		});
	} catch (error) {
		console.error('Error creating property:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : 'An unexpected error occurred' 
			},
			{ status: 500 }
		);
	}
} 