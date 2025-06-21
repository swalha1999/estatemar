import { NextRequest } from 'next/server';
import { NotificationPayload } from './types';

export const parseWhatsAppPayload = async (payload: NextRequest) => {
	const body = await payload.json();
	if (body.object === 'whatsapp_business_account') {
		return body as NotificationPayload;
	}
	return null;
};
