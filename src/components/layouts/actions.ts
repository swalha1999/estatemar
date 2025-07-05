'use server';

import { PropertiesService } from '@/data/access-layer-v2/services';

export async function getLabelForParam(key: string, slug: string): Promise<string> {
	console.log('key', 	key);
	console.log('slug', slug);
	switch (key) {
		case 'propertie_id':
			return (await getPropertyTitle(slug)) ?? slug;
		default:
			return slug;
	}
}

async function getPropertyTitle(property_id: string) {
	const propertiesService = new PropertiesService();
	const property = await propertiesService.getPropertyById(parseInt(property_id));
	return property?.title ?? property_id;
}

