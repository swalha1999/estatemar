import { WhatsAppRepository, ContactsRepository } from '../repositories';
import { BaseService } from './base.service';
import { sendErrorNotification } from '@/lib/discord';

export class WhatsAppService extends BaseService {
	private whatsappRepo = new WhatsAppRepository();
	private contactsRepo = new ContactsRepository();

	async createMessage(messageId: string, contactId: number, messageTemplate: string) {
		if (!messageId) return null;
		
		const result = await this.whatsappRepo.createMessage(messageId, contactId, messageTemplate);
		
		return result;
	}

	async findMessageById(messageId: string) {
		if (!messageId) return null;
		
		return await this.whatsappRepo.findByMessageId(messageId);
	}

	async markMessageAsRead(messageId: string) {
		if (!messageId) return null;
		
		const result = await this.whatsappRepo.updateMessageRead(messageId);
		
		return result;
	}

	async markMessageAsDelivered(messageId: string) {
		if (!messageId) return null;
		
		const result = await this.whatsappRepo.updateMessageDelivered(messageId);
		
		return result;
	}

	async markMessageAsApproved(messageId: string) {
		if (!messageId) return null;
		
		const fetchedMessage = await this.whatsappRepo.findByMessageId(messageId);
		
		if (!fetchedMessage || fetchedMessage.length === 0) return null;
		
		const message = fetchedMessage[0];
		
		if (message.message_template === 'azime_optin_template' && message.contactId) {
			await this.contactsRepo.update(message.contactId, {
				contactConsent: true,
				concentMessageFailed: false,
				contactConsentAt: new Date(),
			});
		}
		
		const result = await this.whatsappRepo.updateMessageApproved(messageId);
		
		return result;
	}

	async markMessageAsDeclined(messageId: string) {
		if (!messageId) return null;
		
		const result = await this.whatsappRepo.updateMessageDeclined(messageId);
		
		return result;
	}

	async markMessageAsSent(messageId: string) {
		if (!messageId) return null;
		
		const result = await this.whatsappRepo.updateMessageSent(messageId);
		
		return result;
	}

	async markMessageAsFailed(messageId: string) {
		if (!messageId) return null;

		const result = await this.whatsappRepo.updateMessageFailed(messageId);

		if (!result || result.length === 0) {
			await sendErrorNotification(
				`Failed to set message ${messageId} as failed`,
				`this message is not in the database`
			);
			return null;
		}

		if (
			result[0] &&
			result[0].contactId &&
			result[0].message_template === 'azime_optin_template'
		) {
			await this.contactsRepo.update(result[0].contactId, {
				concentMessageSent: false,
				concentMessageFailed: true,
				contactConsentAt: null,
			});
		}

		return result;
	}
} 