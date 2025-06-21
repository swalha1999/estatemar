import { eq, asc } from 'drizzle-orm';
import { whatsapp_messages, contacts, type WhatsAppMessage } from '@/db/schema-auth';
import { BaseRepository } from './base';
import { whatsappInterfaceSelect } from '../interfaces/whatsapp.interface';

export class WhatsAppRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...whatsappInterfaceSelect,
			}
		).from(whatsapp_messages).leftJoin(contacts, eq(whatsapp_messages.contactId, contacts.id)).orderBy(asc(whatsapp_messages.id));
	}

	async createMessage(
		messageId: string,
		contactId: number,
		messageTemplate: string
	) {
		if (!messageId) return null;
		
		return await this.db
			.insert(whatsapp_messages)
			.values({ 
				message_id: messageId, 
				contactId: contactId, 
				message_template: messageTemplate 
			})
			.returning();
	}

	async findByMessageId(messageId: string) {
		if (!messageId) return null;
		
		return await this.db.select(
			{
				...whatsappInterfaceSelect,
			}
		).from(whatsapp_messages).leftJoin(contacts, eq(whatsapp_messages.contactId, contacts.id)).where(eq(whatsapp_messages.message_id, messageId));
	}

	async updateMessageRead(messageId: string) {
		if (!messageId) return null;
		
		return await this.db
			.update(whatsapp_messages)
			.set({ message_read: true })
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}

	async updateMessageDelivered(messageId: string) {
		if (!messageId) return null;
		
		return await this.db
			.update(whatsapp_messages)
			.set({ message_delivered: true })
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}

	async updateMessageApproved(messageId: string) {
		if (!messageId) return null;
		
		return await this.db
			.update(whatsapp_messages)
			.set({ approved: true, declined: false })
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}

	async updateMessageDeclined(messageId: string) {
		if (!messageId) return null;
		
		return await this.db
			.update(whatsapp_messages)
			.set({ declined: true, approved: false })
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}

	async updateMessageSent(messageId: string) {
		if (!messageId) return null;
		
		return await this.db
			.update(whatsapp_messages)
			.set({ message_sent: true })
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}

	async updateMessageFailed(messageId: string) {
		if (!messageId) return null;

		return await this.db
			.update(whatsapp_messages)
			.set({ 
				message_failed: true, 
				message_delivered: false, 
				message_read: false 
			})
			.where(eq(whatsapp_messages.message_id, messageId))
			.returning();
	}
} 