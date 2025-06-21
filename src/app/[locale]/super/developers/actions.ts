'use server';

import DAL from '@/data/access-layer-v2';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from '@/i18n/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getLocale } from 'next-intl/server';

const createDeveloperSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	phone: z.string().optional(),
	companyInfo: z.string().optional(),
});

const updateDeveloperSchema = z.object({
	id: z.number(),
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email format'),
	phone: z.string().optional(),
	companyInfo: z.string().optional(),
});

export async function createDeveloperAction(prevState: any, formData: FormData) {
	try {
		const { session, user } = await getCurrentSession();
		if (!session || !user || !user.is_admin) {
			redirect({ href: '/login', locale: 'he' });
		}

		const rawData = {
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			phone: formData.get('phone') as string || undefined,
			companyInfo: formData.get('companyInfo') as string || undefined,
		};

		const validatedData = createDeveloperSchema.parse(rawData);
		
		await DAL.developers.createDeveloper({
			name: validatedData.name,
			email: validatedData.email,
			phone: validatedData.phone || null,
			companyInfo: validatedData.companyInfo || null,
			addedBy: user!.id,
		});

		revalidatePath('/super/developers');
		
		return { success: true, message: 'Developer created successfully' };
	} catch (error) {
		console.error('Error creating developer:', error);
		return { 
			success: false, 
			message: error instanceof Error ? error.message : 'Failed to create developer' 
		};
	}
}

export async function updateDeveloperAction(prevState: any, formData: FormData) {
	try {
		const { session, user } = await getCurrentSession();
		if (!session || !user || !user.is_admin) {
			redirect({ href: '/login', locale: 'he' });
		}

		const rawData = {
			id: parseInt(formData.get('id') as string),
			name: formData.get('name') as string,
			email: formData.get('email') as string,
			phone: formData.get('phone') as string || undefined,
			companyInfo: formData.get('companyInfo') as string || undefined,
		};

		const validatedData = updateDeveloperSchema.parse(rawData);
		
		await DAL.developers.updateDeveloper(validatedData.id, {
			name: validatedData.name,
			email: validatedData.email,
			phone: validatedData.phone || null,
			companyInfo: validatedData.companyInfo || null,
		});

		revalidatePath('/super/developers');
		
		return { success: true, message: 'Developer updated successfully' };
	} catch (error) {
		console.error('Error updating developer:', error);
		return { 
			success: false, 
			message: error instanceof Error ? error.message : 'Failed to update developer' 
		};
	}
}

export async function deleteDeveloperAction(developerId: number) {
	try {
		const { session, user } = await getCurrentSession();
		if (!session || !user || !user.is_admin) {
			redirect({ href: '/login', locale: 'he' });
		}

		await DAL.developers.deleteDeveloper(developerId);

		revalidatePath('/super/developers');
		
		return { success: true, message: 'Developer deleted successfully' };
	} catch (error) {
		console.error('Error deleting developer:', error);
		return { 
			success: false, 
			message: error instanceof Error ? error.message : 'Failed to delete developer' 
		};
	}
}

export async function getDevelopersAction() {
	try {
		const { session, user } = await getCurrentSession();
        const locale = await getLocale();
		if (!session || !user || !user.is_admin) {
			redirect({ href: '/login', locale: locale || 'he' });
		}

		const developers = await DAL.developers.getAllDevelopers();
		
		return { success: true, data: developers };
	} catch (error) {
		console.error('Error fetching developers:', error);
		return { 
			success: false, 
			data: [],
			message: error instanceof Error ? error.message : 'Failed to fetch developers' 
		};
	}
} 