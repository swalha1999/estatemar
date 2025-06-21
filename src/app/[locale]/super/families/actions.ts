'use server';

import { deleteFamily, getFamilies } from '@/db/access-layer/families';
import { revalidatePath } from 'next/cache';

export async function deleteFamilyAction(id: number) {
	await deleteFamily(id);
	revalidatePath('/super/families');
}

export async function exportFamiliesCSV() {
	const families = await getFamilies();
	
	// Use semicolon separator for better Excel compatibility with Arabic text
	const csvRows = [
		'Family ID,Family Name',
		...families.map(family => `${family.id},"${family.name.replace(/"/g, '""')}"`)
	];
	
	const csvContent = csvRows.join('\r\n'); // Use Windows line endings
	
	return csvContent;
}
