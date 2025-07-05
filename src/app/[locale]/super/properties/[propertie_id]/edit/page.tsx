import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PropertiesService } from '@/data/access-layer-v2/services';
import { getSignedUrlForDownload } from '@/lib/storage/r2';
import { EditPropertyForm } from './components/edit-property-form';

interface EditPropertyPageProps {
	params: Promise<{ propertie_id: string }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
	const { propertie_id } = await params;
	const t = await getTranslations('properties');

	// Fetch property with images from server
	const propertiesService = new PropertiesService();
	const property = await propertiesService.getPropertyWithImages(parseInt(propertie_id));

	if (!property) {
		notFound();
	}

	// Transform images to include signed URLs
	const propertyWithImages = {
		...property,
		images: property.images ? await Promise.all(
			property.images.map(async (img) => ({
				id: img.id,
				fileName: img.fileName,
				url: await getSignedUrlForDownload(img.fileName),
				isPrimary: img.isPrimary,
				displayOrder: img.displayOrder,
			}))
		) : []
	};

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">{t('edit.title')}</h1>
				<p className="text-muted-foreground">
					{t('edit.description')}: {property.title}
				</p>
			</div>
			<EditPropertyForm property={propertyWithImages} />
		</div>
	);
} 