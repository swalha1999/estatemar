'use server';

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
	return 'the contact name';
}

async function getFamilyName(family_id: string) {
	return 'the family name';
}
