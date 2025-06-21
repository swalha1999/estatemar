'use server';

import { deleteContact, getContactById, updateContact } from '@/db/access-layer/contacts';
import { revalidatePath } from 'next/cache';
import { sendConcentMessage } from '@/lib/whatsapp';
import { sanitize } from '@/lib/errors';
import { type ConsentStatus } from '@/db/access-layer/contacts';
import { ContactsService } from '@/db/access-layer-v2/services/contacts.service';
import { type ContactSearchParams } from '@/db/access-layer-v2/interfaces/contact.interface';
/**
 * Server action to delete a contact
 * @param id The ID of the contact to delete
 * @returns The result of the operation
 */
export async function deleteContactAction(id: number) {
	try {
		await deleteContact(id);
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error deleting contact:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

/**
 * Server action to update a contact's consent status
 * @param id The ID of the contact to update
 * @param consent The new consent status
 * @returns The result of the operation
 */
export async function sendConcentMessageAction(id: number) {
	// TODO: Implement this
	console.log('TODO: not implemented yet the send of the concent message');
}

export async function resetConcentStatusAction(id: number) {
	try {
		await updateContact(id, { concentMessageFailed: false, concentMessageSent: false });
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error resetting contact consent:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

export async function markContactAsOptOutAction(id: number) {
	try {
		await updateContact(id, { optOut: true, contactConsent: false });
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error marking contact as opt-out:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

/**
 * Server action to update a contact's status (used for the dropdown)
 * @param id The ID of the contact to update
 * @param status The new consent status
 * @returns The result of the operation
 */
export async function updateContactStatusAction(id: number, status: ConsentStatus) {
	try {
		// Reset all status fields first
		const resetData = {
			contactConsent: false,
			optOut: false,
			concentMessageSent: false,
			concentMessageFailed: false,
		};

		// Set appropriate fields based on status
		switch (status) {
			case 'gave_consent':
				resetData.contactConsent = true;
				break;
			case 'declined':
				resetData.optOut = true;
				break;
			case 'concent_message_failed':
				resetData.concentMessageFailed = true;
				resetData.concentMessageSent = true;
				break;
			case 'no_response':
				resetData.concentMessageSent = true;
				break;
			case 'concent_message_not_sent':
				// All fields remain false (reset state)
				break;
		}

		await updateContact(id, resetData);
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error updating contact status:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

export async function approveContactAction(id: number) {
	try {
		await updateContact(id, { approved: true });
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error approving contact:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

export async function unapproveContactAction(id: number) {
	try {
		await updateContact(id, { approved: false });
		revalidatePath('/super/contacts');
		return { success: true };
	} catch (error) {
		console.error('Error unapproving contact:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

export async function bulkApproveContactsAction(searchParams?: ContactSearchParams) {
	try {
		const contactsService = new ContactsService();
		const result = await contactsService.bulkUpdateApproval(true, searchParams);
		revalidatePath('/super/contacts');
		return { success: true, count: result.count };
	} catch (error) {
		console.error('Error bulk approving contacts:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
			count: 0,
		};
	}
}

export async function bulkUnapproveContactsAction(searchParams?: ContactSearchParams) {
	try {
		const contactsService = new ContactsService();
		const result = await contactsService.bulkUpdateApproval(false, searchParams);
		revalidatePath('/super/contacts');
		return { success: true, count: result.count };
	} catch (error) {
		console.error('Error bulk unapproving contacts:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
			count: 0,
		};
	}
}
