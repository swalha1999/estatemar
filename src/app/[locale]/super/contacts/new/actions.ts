'use server';

import { getCurrentSession } from '@/core/auth/session';
import dal from '@/db/access-layer-v2';
import { Contact } from '@/db/schema-auth';
import { ActionResult } from '@/types/actionType';
import type { E164Number } from 'libphonenumber-js';
import { formatNumber } from 'libphonenumber-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import * as XLSX from 'xlsx';

import { sanitize } from '@/lib/errors';

export type ContactFormData = Omit<Contact, 'id' | 'approvedAt' | 'contactConsentAt' | 'optOutAt'>;

const contactFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	middleName: z.string().nullable(),
	previousFamilyName: z.string().nullable(),
	birthYear: z.number().nullable(),
	gender: z.string().nullable(),
	phone: z.union([z.string(), z.custom<E164Number>()]).optional(),
	homeNumber: z.number().min(1, 'Home number is required'),
	street: z.string().nullable(),
	town: z.string().min(1, 'Town is required'),
	personalNumber: z.number().nullable(),
	familyId: z.number().min(0, 'FamilyId is required'),
});

/**
 * Server action to add a new contact
 * @param prevState The previous state
 * @param formData The form data
 * @returns The result of the operation
 */
export async function addContact(
	prevState: ActionResult,
	formData: FormData
): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();

	if (!session || !user) {
		console.error('Unauthorized');
		return { is_success: false, message: 'Unauthorized' };
	}

	const data = {
		firstName: formData.get('firstName'),
		middleName: formData.get('middleName'),
		previousFamilyName: formData.get('previousFamilyName'),
		birthYear: formData.get('birthYear') ? parseInt(formData.get('birthYear') as string) : null,
		gender: formData.get('gender')?.toString() ?? null,
		phone: formData.get('phone')?.toString() ?? null,
		personalNumber: formData.get('personalNumber')
			? parseInt(formData.get('personalNumber') as string)
			: null,
		homeNumber: formData.get('homeNumber')
			? parseInt(formData.get('homeNumber') as string)
			: null,
		street: formData.get('streetNumber')?.toString() ?? null,
		town: formData.get('town')?.toString() ?? '',
		familyId: parseInt(formData.get('familyId') as string),
	};

	const payload = contactFormSchema.safeParse(data);

	if (!payload.success) {
		console.error('Invalid data', payload.error);
		return { is_success: false, message: 'Invalid data' };
	}

	const [household, householdError] = await sanitize(
		dal.contacts.getOrCreateHousehold(payload.data.homeNumber, payload.data.street ?? '', payload.data.town)
	);

	if (householdError) {
		console.error('Error in getOrCreateHousehold', householdError);
		return { is_success: false, message: householdError.message };
	}

	const [, contactError] = await sanitize(
		dal.contacts.createContact({
			...payload.data,
			title: payload.data.gender as string,
			phone: payload.data.phone?.toString() ?? null,
			addedBy: user.id,
			householdId: household.id,
			familyId: payload.data.familyId,
			approved: true,
			contactConsent: false,
			concentMessageFailed: false,
			optOut: false,
		})
	);

	if (contactError) {
		console.error('Error in createContact', contactError);
		return { is_success: false, message: contactError.message };
	}

	revalidatePath('/super/contacts');

	return {
		is_success: true,
		message: 'Contact created successfully',
	};
}
