import { getTranslations } from 'next-intl/server';
import { PropertiesService } from '@/data/access-layer-v2/services';
import { PropertyManagement } from './components/property-management';

export default async function PropertiesPage({
	searchParams,
}: {
	searchParams: Promise<{ 
		page?: string; 
		limit?: string;
		search?: string;
		propertyType?: string;
		listingType?: string;
		isAvailable?: string;
		isFeatured?: string;
	}>
}) {
	const t = await getTranslations('properties');
	const params = await searchParams;
	
	const propertiesService = new PropertiesService();
	const { data: properties, total, totalPages } = await propertiesService.getAllProperties({
		page: params.page || '1',
		limit: params.limit || '10',
		location: params.search,
		propertyType: params.propertyType as any,
		listingType: params.listingType as any,
		isAvailable: params.isAvailable === 'true' ? true : params.isAvailable === 'false' ? false : undefined,
		isFeatured: params.isFeatured === 'true' ? true : params.isFeatured === 'false' ? false : undefined,
	});

	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<h1 className="text-2xl font-bold mb-2">Property Management</h1>
				<p className="text-muted-foreground">Manage all properties in the system</p>
			</div>
			
			<PropertyManagement 
				properties={properties}
				total={total}
				totalPages={totalPages}
				currentPage={parseInt(params.page || '1')}
				limit={parseInt(params.limit || '10')}
			/>
		</div>
	);
} 