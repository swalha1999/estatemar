'use server';

import { getSignedUrlForDownload } from '@/lib/storage/r2';
import { sendHallInviteMessage as sendHallInviteWhatsApp } from '@/lib/whatsapp/templates/hall_invite';
import { ActionResult } from '@/types/actionType';
import { z } from 'zod';

const whatsAppFormSchema = z.object({
	phoneNumber: z.string().min(1, 'Phone number is required'),
	groomName: z.string().min(1, 'Groom name is required'),
	brideName: z.string().min(1, 'Bride name is required'),
	address: z.string().min(1, 'Address is required'),
	date: z.string().min(1, 'Date is required'),
	time: z.string().min(1, 'Time is required'),
	whatsappMessageId: z.string().nullish(),
	imageKey: z.string().nullish(),
	inviterName: z.string().min(1, 'Inviter name is required'),
	recipientName: z.string().min(1, 'Recipient name is required'),
});

export async function sendHallInviteMessageAction(
	prevState: ActionResult,
	formData: FormData
): Promise<ActionResult> {
	try {
		const data = {
			phoneNumber: formData.get('phoneNumber'),
			groomName: formData.get('groomName'),
			brideName: formData.get('brideName'),
			address: formData.get('address'),
			date: formData.get('date'),
			time: formData.get('time'),
			whatsappMessageId: formData.get('whatsappMessageId'),
			imageKey: formData.get('imageKey'),
			inviterName: formData.get('inviterName'),
			recipientName: formData.get('recipientName'),
		};

		const validatedData = whatsAppFormSchema.parse(data);

		const imageLink = validatedData.imageKey
			? await getSignedUrlForDownload(validatedData.imageKey)
			: 'https://azimh.com/wp-content/uploads/2025/03/example.jpeg';

		const messageId = await sendHallInviteWhatsApp({
			phoneNumber: validatedData.phoneNumber,
			recipientName: validatedData.recipientName,
			inviterName: validatedData.inviterName,
			coupleName: `${validatedData.groomName} و${validatedData.brideName}`,
			hallLocation: validatedData.address,
			date: validatedData.date,
			time: validatedData.time,
			whatsappMessageId: '',
			imageUrl: imageLink,
		});

		return { message: 'success', data: { messageId } };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { message: 'invalidFields' };
		}
		
		console.error('Error sending hall invite message:', error);
		return { message: 'error' };
	}
}