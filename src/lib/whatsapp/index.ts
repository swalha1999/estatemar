import { getContactById, updateContact } from '@/db/access-layer/contacts';
import { getFileById } from '@/db/access-layer/files';
import { createWhatsAppMessage, setMessageAsSent } from '@/db/access-layer/whatsapp';
import { sendErrorNotification } from '@/lib/discord';
import { sanitize } from '../errors';
import { Contact, Invite } from '@/db/schema-auth';
import { getSignedUrlForDownload } from '@/lib/storage/r2';


const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export const sendConcentMessage = async (data: {
	phoneNumber: string;
	contactTitle: string;
	contactName: string;
	contactMiddleName: string | null;
	contactFamilyName: string;
	contactPreviousFamilyName: string | null;
	contactId: number;
}) => {
	const fullContactName = `${data.contactTitle} ${data.contactName}${data.contactMiddleName ? ` ${data.contactMiddleName}` : ''} ${data.contactPreviousFamilyName ? `${data.contactPreviousFamilyName}-` : ''}${data.contactFamilyName}`;

	const response = await fetch(
		`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${WHATSAPP_TOKEN}`,
			},
			body: JSON.stringify({
				messaging_product: 'whatsapp',
				to: data.phoneNumber,
				type: 'template',
				template: {
					name: 'azime_optin_template',
					language: { code: 'ar' },
					components: [
						{
							type: 'body',
							parameters: [
								{
									type: 'text',
									text: fullContactName,
								},
								{
									type: 'text',
									text: 'https://www.instagram.com/azimh_wedding',
								},
								{
									type: 'text',
									text: 'https://www.facebook.com/share/149XoC1Pab',
								},
								{
									type: 'text',
									text: 'https://azimh.com',
								},
							],
						},
						{
							type: 'button',
							sub_type: 'quick_reply',
							index: '2',
							parameters: [
								{
									type: 'payload',
									payload: 'rsvp_yes',
								},
							],
						},
					],
				},
			}),
		}
	);

	if (!response.ok) {
		console.error('Failed to send message for contact', data.phoneNumber, response);
		await sendErrorNotification(
			'Failed to send message for contact',
			`Failed to send message for contact ${data.phoneNumber}: Meta API response: ${response}`
		);
		throw new Error('Failed to send message Meta API');
	}

	const message_data = await response.json();

	console.log('Message sent successfully', message_data);

	const [contact, contactError] = await sanitize(getContactById(data.contactId));

	if (!contact || contactError) {
		console.error('Contact not found', data.phoneNumber, contactError);
		await sendErrorNotification(
			'Contact not found',
			`Contact with phone number ${data.phoneNumber} not found`
		);
		throw new Error('Contact not found');
	}

	const [, createWhatsAppMessageError] = await sanitize(
		createWhatsAppMessage(message_data.messages[0].id, contact.id, 'azime_optin_template')
	);
	if (createWhatsAppMessageError) {
		console.error(
			'Failed to save WhatsApp message in DB',
			message_data.messages[0].id,
			contact.id,
			createWhatsAppMessageError
		);
		await sendErrorNotification(
			'Failed to save WhatsApp message in DB',
			`Failed to save WhatsApp message in DB for contact ${contact.id}: ${createWhatsAppMessageError}`
		);
		throw new Error('Failed to save WhatsApp message in DB');
	}

	const [, setMessageAsSentError] = await sanitize(setMessageAsSent(message_data.messages[0].id));
	if (setMessageAsSentError) {
		console.error(
			'Failed to set message as sent in DB',
			message_data.messages[0].id,
			setMessageAsSentError
		);
		await sendErrorNotification(
			'Failed to set message as sent in DB',
			`Failed to set message as sent in DB for message ${message_data.messages[0].id}: ${setMessageAsSentError}`
		);
		throw new Error('Failed to set message as sent in DB');
	}

	const [, updateContactError] = await sanitize(
		updateContact(contact.id, { concentMessageSent: true, concentMessageFailed: false })
	);
	if (updateContactError) {
		console.error('Failed to update contact in DB', contact.id, updateContactError);
		await sendErrorNotification(
			'Failed to update contact in DB',
			`Failed to update contact in DB for contact ${contact.id}: ${updateContactError}`
		);
		throw new Error('Failed to update contact in DB');
	}

	return message_data;
};

export const sendNoReplyMessage = async (data: { phoneNumber: string }) => {
	const response = await fetch(
		`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${WHATSAPP_TOKEN}`,
			},
			body: JSON.stringify({
				messaging_product: 'whatsapp',
				to: data.phoneNumber,
				type: 'text',
				text: {
					body: `هذا الرقم يُستخدم فقط لإرسال الدعوات، ولا يمكن الرد من خلاله. لأي استفسار او طلب يرجى إرسال رسالة واتساب على الرقم التالي : 0515553434\nمع فائق الاحترام، فريق عزيمة\nيسعدنا خدمتكم.`,
				},
			}),
		}
	);

	if (!response.ok) {
		console.error('Failed to send message', response);
		await sendErrorNotification(
			'Failed to send message',
			`Failed to send message for contact ${data.phoneNumber}: Meta API response: ${response}`
		);
		throw new Error('Failed to send message');
	}

	const message_data = await response.json();
	return message_data;
};

export async function sendInviteWhatsAppMessage(invitation: Invite, contact: Contact) {
	try {
		const phoneNumber = contact.phone;
		const groomName = invitation.groomName;
		const brideName = invitation.brideName;
		const address = invitation.location;
		const templateType = invitation.whatsappTemplate;
		const date = new Date(invitation.date).toLocaleDateString('ar-EG', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
		});
		const time = new Date(invitation.date).toLocaleTimeString('ar-EG', {
			hour: '2-digit',
			minute: '2-digit',
		});
		const imageKey = invitation.weddingCardFileId? (await getFileById(invitation.weddingCardFileId))?.fileName : null;
		const imageLink = imageKey
			? await getSignedUrlForDownload(imageKey)
			: 'https://azimh.com/wp-content/uploads/2025/03/example.jpeg';
		console.log(imageLink);
		const response = await fetch(
			`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${WHATSAPP_TOKEN}`,
				},
				body: JSON.stringify({
					messaging_product: 'whatsapp',
					to: phoneNumber,
					type: 'template',
					template: {
						name: templateType,
						language: { code: 'ar' },
						components: [
							{
								type: 'header',
								parameters: [
									{
										type: 'image',
										image: {
											link: imageLink,
										},
									},
								],
							},
							{
								type: 'body',
								parameters: [
									{
										type: 'text',
										text: groomName,
										parameter_name: 'groom',
									},
									{
										type: 'text',
										text: brideName,
										parameter_name: 'bride',
									},
									{
										type: 'text',
										text: address,
										parameter_name: 'address',
									},
									{
										type: 'text',
										text: date,
										parameter_name: 'date',
									},
									{
										type: 'text',
										text: time,
										parameter_name: 'time',
									},
								],
							},
							{
								type: 'button',
								sub_type: 'quick_reply',
								index: 0,
								parameters: [{ type: 'payload', payload: 'rsvp_yes' }],
							},
							{
								type: 'button',
								sub_type: 'quick_reply',
								index: 1,
								parameters: [{ type: 'payload', payload: 'rsvp_no' }],
							},
						],
					},
				}),
			}
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Failed to send WhatsApp message');
		}

		const message_data = await response.json();
		const messageId = message_data.messages[0].id;
		return messageId;
	} catch (error) {
		return false;
	}
}

