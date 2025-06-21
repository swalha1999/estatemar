'use server';

import { db } from '@/db';
import { families } from '@/db/schema-auth';
import { ActionResult } from '@/types/actionType';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

export async function editFamily(
	prevState: ActionResult,
	formData: FormData
): Promise<ActionResult> {
	const id = parseInt(formData.get('id') as string);
	const name = formData.get('name') as string;

	if (!name) {
		return { message: 'Name is required' };
	}

	try {
		await db.update(families).set({ name }).where(eq(families.id, id));

		revalidatePath('/super/families');
		return { message: 'Family updated successfully' };
	} catch (error) {
		return { message: 'Failed to update family' };
	}
}
