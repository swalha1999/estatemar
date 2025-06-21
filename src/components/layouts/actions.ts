'use server';

import { getContactById } from '@/db/access-layer/contacts';
import { getFamily } from '@/db/access-layer/families';
export async function getLabelForParam(key: string, slug: string): Promise<string> {
	switch (key) {
		case 'contact_id':
			return (await getContactName(slug)) ?? slug;
		case 'family_id':
			return (await getFamilyName(slug)) ?? slug;
		default:
			return slug;
	}
}

async function getContactName(contact_id: string) {
	const contact = await getContactById(parseInt(contact_id));
	if (!contact) {
		return null;
	}
	return contact.firstName + ' ' + contact.family?.name;
}

async function getFamilyName(family_id: string) {
	const family = await getFamily(parseInt(family_id));
	return family?.name;
}
