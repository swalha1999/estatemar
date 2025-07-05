import { NextRequest, NextResponse } from 'next/server';
import { PropertiesService } from '@/data/access-layer-v2/services';
import { getSignedUrlForDownload } from '@/lib/storage/r2';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const propertyId = parseInt(id);

		if (isNaN(propertyId)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid property ID' },
				{ status: 400 }
			);
		}

		const propertiesService = new PropertiesService();
		const propertyWithImages = await propertiesService.getPropertyWithImages(propertyId);

		if (!propertyWithImages) {
			return NextResponse.json(
				{ success: false, error: 'Property not found' },
				{ status: 404 }
			);
		}

		// Generate signed URLs for images
		const imageUrls = await Promise.all(
			propertyWithImages.images.map(async (img) => {
				try {
					const url = await getSignedUrlForDownload(img.fileName);
					return url;
				} catch (error) {
					console.error('Error generating signed URL for', img.fileName, ':', error);
					return null;
				}
			})
		);

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
			imageUrls: imageUrls.filter(Boolean),
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
		console.error('Error fetching property:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : 'An unexpected error occurred' 
			},
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const propertyId = parseInt(id);

		if (isNaN(propertyId)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid property ID' },
				{ status: 400 }
			);
		}

		const body = await request.json();
		const propertiesService = new PropertiesService();
		
		// Validate the property data
		await propertiesService.validatePropertyData(body);
		
		// Update the property
		const updatedProperty = await propertiesService.updateProperty(propertyId, body);
		
		// Get the updated property with images
		const propertyWithImages = await propertiesService.getPropertyWithImages(propertyId);

		// Generate signed URLs for images
		const imageUrls = await Promise.all(
			propertyWithImages.images.map(async (img) => {
				try {
					const url = await getSignedUrlForDownload(img.fileName);
					return url;
				} catch (error) {
					console.error('Error generating signed URL for', img.fileName, ':', error);
					return null;
				}
			})
		);

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
			imageUrls: imageUrls.filter(Boolean),
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
		console.error('Error updating property:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : 'An unexpected error occurred' 
			},
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const propertyId = parseInt(id);

		if (isNaN(propertyId)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid property ID' },
				{ status: 400 }
			);
		}

		const propertiesService = new PropertiesService();
		await propertiesService.deleteProperty(propertyId);

		return NextResponse.json({
			success: true,
			message: 'Property deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting property:', error);
		return NextResponse.json(
			{ 
				success: false, 
				error: error instanceof Error ? error.message : 'An unexpected error occurred' 
			},
			{ status: 500 }
		);
	}
} 