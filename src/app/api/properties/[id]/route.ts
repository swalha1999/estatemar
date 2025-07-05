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
				return getSignedUrlForDownload(img.fileName);
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