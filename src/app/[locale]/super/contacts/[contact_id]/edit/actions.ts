'use server';

import { getCurrentSession } from '@/core/auth/session';
import dal from '@/db/access-layer-v2';
import { Contact } from '@/db/schema-auth';
import { ActionResult } from '@/types/actionType';
import type { E164Number } from 'libphonenumber-js';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { sanitize } from '@/lib/errors';
import { redirect } from 'next/navigation';

const titles_enum = ['السيد', 'السيدة', 'الاخ', 'الاخت', 'الشيخ', 'الخالة'] as const;

const title_type = z.enum(titles_enum, {
	required_error: 'اللقب مطلوب',
	invalid_type_error: 'اللقب غير صحيح',
});

const contactFormSchema = z.object({
	gender: title_type,
	birthYear: z.string().min(1, {
		message: 'سنة الميلاد مطلوبة',
	}),
	firstName: z.string().min(1, {
		message: 'الاسم الأول مطلوب',
	}),
	middleName: z.string().nullable(),
	previousFamilyName: z.string().optional(),
	phone: z.union([z.string(), z.custom<E164Number>()]).optional(),
	homeNumber: z.string().min(1, {
		message: 'رقم المنزل مطلوب',
	}),
	streetNumber: z.string().min(1, {
		message: 'الحارة مطلوبة',
	}),
	personalNumber: z.string().min(1, {
		message: 'الرقم الشخصي مطلوب',
	}),
	town: z.string().min(1, {
		message: 'القرية مطلوبة',
	}),
	approved: z.boolean().default(false).optional(),
	contactConsent: z.boolean().default(false).optional(),
	optOut: z.boolean().default(false).optional(),
	familyId: z.string().min(1, {
		message: 'العائلة مطلوبة',
	}),
});

export async function editContactAction(
	prevState: ActionResult,
	formData: FormData
): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();

	if (!session || !user) {
		return { message: 'Unauthorized' };
	}

	const contactId = formData.get('id');
	if (!contactId) {
		return { message: 'Contact ID is required' };
	}

	const data = {
		gender: formData.get('gender'),
		birthYear: formData.get('birthYear'),
		firstName: formData.get('firstName'),
		middleName: formData.get('middleName'),
		previousFamilyName: formData.get('previousFamilyName'),
		phone: formData.get('phone')?.toString() ?? null,
		personalNumber: formData.get('personalNumber')?.toString() ?? '',
		homeNumber: formData.get('homeNumber')?.toString() ?? '',
		streetNumber: formData.get('streetNumber')?.toString() ?? '',
		town: formData.get('town')?.toString() ?? '',
		approved: formData.get('approved') === 'true',
		contactConsent: formData.get('contactConsent') === 'true',
		optOut: formData.get('optOut') === 'true',
		familyId: formData.get('familyId')?.toString() ?? '',
	};

	const payload = contactFormSchema.safeParse(data);

	if (!payload.success) {
		return { message: 'Invalid data' };
	}

	const [household, householdError] = await sanitize(
		dal.contacts.getOrCreateHousehold(
			parseInt(payload.data.homeNumber),
			payload.data.streetNumber,
			payload.data.town
		)
	);

	if (householdError) {
		return { message: householdError.message };
	}

	const [, contactError] = await sanitize(
		dal.contacts.updateContact(parseInt(contactId as string), {
			gender: payload.data.gender,
			birthYear: parseInt(payload.data.birthYear) || null,
			firstName: payload.data.firstName,
			middleName: payload.data.middleName,
			previousFamilyName: payload.data.previousFamilyName,
			phone: payload.data.phone?.toString() ?? null,
			personalNumber: parseInt(payload.data.personalNumber),
			householdId: household.id,
			familyId: parseInt(payload.data.familyId),
			approved: payload.data.approved,
			contactConsent: payload.data.contactConsent,
			optOut: payload.data.optOut,
		})
	);

	if (contactError) {
		return { message: contactError.message };
	}

	revalidatePath('/super/contacts');
	redirect(`/super/contacts`);

	return { message: 'Contact updated successfully' };
}
