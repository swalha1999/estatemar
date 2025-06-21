'use server';

import { db } from '@/db';
import { createFamily } from '@/db/access-layer/families';
import { families } from '@/db/schema-auth';
import { ActionResult } from '@/types/actionType';
import { revalidatePath } from 'next/cache';

export async function addFamily(
	prevState: ActionResult,
	formData: FormData
): Promise<ActionResult> {
	const name = formData.get('name') as string;

	if (!name) {
		return { message: 'Name is required' };
	}

	try {
		await createFamily(name);

		revalidatePath('/super/families');
		return { message: 'Family added successfully' };
	} catch (error) {
		return { message: 'Failed to add family'};
	}
}
