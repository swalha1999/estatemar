import { sendErrorNotification } from '@/lib/discord';
import { checkWhatsAppRateLimit } from '@/lib/whatsapp/limit';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export interface HallInviteData {
	recipientName: string;
	inviterName: string;
	coupleName: string;
	hallLocation: string;
	date: string;
	time: string;
	phoneNumber: string;
	whatsappMessageId: string;
	imageUrl: string;
}

export const sendHallInviteMessage = async (data: HallInviteData) => {
	try {
		// Check rate limit first
		const rateLimitCheck = await checkWhatsAppRateLimit();
		
		if (!rateLimitCheck.canSend) {
			const errorMessage = `Cannot send message due to rate limit. ${rateLimitCheck.rateLimitInfo?.message || 'Rate limit exceeded'}`;
			console.error(errorMessage);
			await sendErrorNotification(
				'WhatsApp Rate Limit Exceeded',
				`Cannot send hall invite message to ${data.phoneNumber}. ${errorMessage}`
			);
			throw new Error(errorMessage);
		}

		console.log('Rate limit check passed, proceeding to send message');

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
						name: 'hall_invite_v2',
						language: { code: 'ar' },
						components: [
                            {
								type: 'header',
								parameters: [
									{
										type: 'image',
										image: {
											link: data.imageUrl
										}
									}
								]
							},
							{
								type: 'body',
								parameters: [
									{
										type: 'text',
										text: data.recipientName,
									},
									{
										type: 'text',
										text: data.inviterName,
									},
									{
										type: 'text',
										text: data.coupleName,
									},
									{
										type: 'text',
										text: data.hallLocation,
									},
									{
										type: 'text',
										text: data.date,
									},
									{
										type: 'text',
										text: data.time,
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
			const errorData = await response.json();
			console.error('Failed to send hall invite message for contact', data.phoneNumber, errorData);
			await sendErrorNotification(
				'Failed to send hall invite message for contact',
				`Failed to send hall invite message for contact ${data.phoneNumber}: Meta API response: ${JSON.stringify(errorData)}`
			);
			throw new Error('Failed to send hall invite message Meta API');
		}

		const message_data = await response.json();

		return message_data.messages[0].id as string;
	} catch (error) {
		console.error('Error sending hall invite message:', error);
        console.error(data);
		throw error;
	}
};
