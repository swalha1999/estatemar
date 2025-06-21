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

/**
 * Server action to import contacts from an Excel file
 * @param formData The form data containing the Excel file
 * @returns The result of the operation
 */
export async function importContacts(formData: FormData) {
	try {
		const { user } = await getCurrentSession();
		if (!user) {
			throw new Error('User not authenticated');
		}

		if (!user.is_admin) {
			throw new Error('Only admins can import contacts');
		}

		const file = formData.get('file') as File;
		if (!file) {
			throw new Error('No file provided');
		}

		const buffer = await file.arrayBuffer();
		const workbook = XLSX.read(buffer);
		const worksheet = workbook.Sheets[workbook.SheetNames[0]];

		interface ExcelRow {
			firstName: string;
			middleName?: string;
			previousFamilyName?: string;
			birthYear?: string;
			gender?: string;
			phone?: string;
			personalNumber?: string;
			homeNumber?: string;
			street?: string;
			town?: string;
			familyName?: string;
		}

		const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

		let successCount = 0;
		const errors: string[] = [];

		for (const [index, row] of data.entries()) {
			try {
				const parsedHomeNumber = parseInt(row.homeNumber || '0', 10);
				const parsedPersonalNumber = row.personalNumber
					? parseInt(row.personalNumber, 10)
					: null;
				let formattedPhone = null;
				if (row.phone) {
					const cleanedPhone = String(row.phone).replace(/[\s-]/g, '');
					if (cleanedPhone.startsWith('0')) {
						formattedPhone = `+972${cleanedPhone.slice(1)}`;
					} else {
						formattedPhone = `+972${cleanedPhone}`;
					}
				}

				// Get or create family
				const [family, familyError] = await sanitize(
					dal.families.getOrCreateFamily(row.familyName || 'Unknown Family')
				);

				if (familyError) {
					errors.push(
						`Row ${index + 2}: Error getting/creating family - ${familyError.message}. Data: ${JSON.stringify(row)}`
					);
					continue;
				}

				const dataForValidation = {
					firstName: row.firstName,
					middleName: row.middleName ?? null,
					previousFamilyName: row.previousFamilyName ?? null,
					birthYear: row.birthYear ? parseInt(row.birthYear) : null,
					gender: row.gender ?? null,
					phone: formattedPhone ?? undefined,
					personalNumber: parsedPersonalNumber,
					homeNumber: !isNaN(parsedHomeNumber) ? parsedHomeNumber : undefined,
					street: row.street ?? null,
					town: row.town ?? 'Unknown',
					familyId: family.id,
				};

				const validationResult = contactFormSchema.safeParse(dataForValidation);

				if (!validationResult.success) {
					const formattedErrors = validationResult.error.errors
						.map((err) => `${err.path.join('.')}: ${err.message}`)
						.join('; ');
					errors.push(
						`Row ${index + 2}: Validation failed - ${formattedErrors}. Data: ${JSON.stringify(row)}`
					);
					console.error(
						`Row ${index + 2}: Validation failed - ${formattedErrors}. Data: ${JSON.stringify(row)}`
					);
					continue;
				}

				const validatedData = validationResult.data;

				const [household, householdError] = await sanitize(
					dal.contacts.getOrCreateHousehold(
						validatedData.homeNumber,
						validatedData.street || '',
						validatedData.town
					)
				);

				if (householdError) {
					errors.push(
						`Row ${index + 2}: Error getting/creating household - ${householdError.message}. Data: ${JSON.stringify(row)}`
					);
					console.error(
						`Row ${index + 2}: Error getting/creating household - ${householdError.message}. Data: ${JSON.stringify(row)}`
					);
					continue;
				}

				const [, contactError] = await sanitize(
					dal.contacts.createContact({
						...validatedData,
						phone: validatedData.phone?.toString() ?? null,
						addedBy: user.id,
						householdId: household.id,
						familyId: validatedData.familyId,
						approved: true,
						contactConsent: false,
						concentMessageFailed: false,
						optOut: false,
						title: validatedData.gender as string,
					})
				);

				if (contactError) {
					errors.push(
						`Row ${index + 2}: Error creating contact - ${contactError.message}. Data: ${JSON.stringify(row)}`
					);
					console.error(
						`Row ${index + 2}: Error creating contact - ${contactError.message}. Data: ${JSON.stringify(row)}`
					);
					continue;
				}
				successCount++;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error processing row';
				errors.push(`Row ${index + 2}: ${errorMessage}. Data: ${JSON.stringify(row)}`);
				console.error(`Row ${index + 2}: ${errorMessage}. Data: ${JSON.stringify(row)}`);
			}
		}

		revalidatePath('/super/contacts');
		return {
			success: true,
			count: successCount,
			errors: errors.length > 0 ? errors : undefined,
		};
	} catch (error) {
		console.error('Error importing contacts:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}
