import { eq } from 'drizzle-orm';
import { db } from '..';
import { contacts, whatsapp_messages, WhatsAppMessage } from '../schema-auth';
import { updateContact } from './contacts';
import { sendErrorNotification } from '@/lib/discord';

export async function createWhatsAppMessage(
	message: WhatsAppMessage['message_id'],
	contactId: number,
	messageTemplate: string
) {
	if (!message) return null;
	const sentMessage = await db
		.insert(whatsapp_messages)
		.values({ message_id: message, contactId: contactId, message_template: messageTemplate })
		.returning();
	return sentMessage;
}

export async function setMessageAsSeen(message: WhatsAppMessage['message_id']) {
	if (!message) return null;
	const updatedMessage = await db
		.update(whatsapp_messages)
		.set({ message_read: true,  readAt: new Date()})	
		.where(eq(whatsapp_messages.message_id, message));
	return updatedMessage;
}

export async function setMessageAsDelivered(message: WhatsAppMessage['message_id']) {
	if (!message) return null;
	const updatedMessage = await db
		.update(whatsapp_messages)
		.set({ message_delivered: true, deliveredAt: new Date() })
		.where(eq(whatsapp_messages.message_id, message));
	return updatedMessage;
}

export async function setMessageAsApproved(message: WhatsAppMessage['message_id']) {
	if (!message) return null;
	const fetchedMessage = await db.query.whatsapp_messages.findFirst({
		where: eq(whatsapp_messages.message_id, message),
		with: {
			contact: true,
		},
	});
	if (!fetchedMessage) return null;
	if (fetchedMessage.message_template === 'azime_optin_template' && fetchedMessage.contact?.id) {
		await updateContact(fetchedMessage.contact.id, {
			contactConsent: true,
			concentMessageFailed: false,
			contactConsentAt: new Date(),
		});
	}
	const updatedMessage = (
		await db
			.update(whatsapp_messages)
			.set({ approved: true, declined: false })
			.where(eq(whatsapp_messages.message_id, message))
			.returning()
	)[0];
	return updatedMessage;
}

export async function setMessageAsDeclined(message: WhatsAppMessage['message_id']) {
	if (!message) return null;
	const updatedMessage = await db
		.update(whatsapp_messages)
		.set({ declined: true, approved: false })
		.where(eq(whatsapp_messages.message_id, message));
	return updatedMessage;
}

export async function setMessageAsSent(message: WhatsAppMessage['message_id']) {
	if (!message) return null;
	const updatedMessage = await db
		.update(whatsapp_messages)
		.set({ message_sent: true, sentAt: new Date() })
		.where(eq(whatsapp_messages.message_id, message));
	return updatedMessage;
}

export async function setMessageAsFailed(message: WhatsAppMessage['message_id']) {
	if (!message) return null;

	const updatedMessage = await db
		.update(whatsapp_messages)
		.set({ message_failed: true, message_delivered: false, message_read: false })
		.where(eq(whatsapp_messages.message_id, message))
		.returning();

	if (updatedMessage.length === 0) {
		await sendErrorNotification(
			`Failed to set message ${message} as failed`,
			`this message is not in the database`
		);
	}

	if (
		updatedMessage[0] &&
		updatedMessage[0].contactId &&
		updatedMessage[0].message_template === 'azime_optin_template'
	) {
		await updateContact(updatedMessage[0].contactId, {
			concentMessageSent: false,
			concentMessageFailed: true,
			contactConsentAt: null,
		});
	}

	return updatedMessage;
}