import {
	setMessageAsApproved,
	setMessageAsDeclined,
	setMessageAsDelivered,
	setMessageAsFailed,
	setMessageAsSeen,
} from '@/db/access-layer/whatsapp';
import { sendErrorNotification } from '@/lib/discord';
import { sendNoReplyMessage } from '@/lib/whatsapp';
import { parseWhatsAppPayload } from '@/lib/whatsapp/payload';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	try {
		const body = await parseWhatsAppPayload(req);
		console.log('Body:', body);
		if (!body) {
			console.error('Invalid payload received and ignored');
			return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
		}

		const changes = body.entry[0].changes || [];
		for (const change of changes) {
			if (change.field === 'messages') {
				const messages = change.value.messages || [];

				for (const message of messages) {
					console.log('Message received:', message);
					if (message.type === 'button') {
						if (
							message.button?.payload === 'rsvp_yes' ||
							message.button?.payload === 'موافق' ||
							message.button?.text === 'موافق' ||
							message.button?.text === 'تأكيد الحضور'
						) {
							await setMessageAsApproved(message.context?.id || null);
						} else if (
							message.button?.payload === 'rsvp_no' ||
							message.button?.payload === 'عدم الحضور' ||
							message.button?.text === 'عدم الحضور'
						) {
							await setMessageAsDeclined(message.context?.id || null);
						}
					} else if (message.type === 'text') {
						if (
							message.text?.body === 'موافق' ||
							message.text?.body === 'تأكيد الحضور'
						) {
							await setMessageAsApproved(message.context?.id || null);
						} else if (message.text?.body === 'عدم الحضور') {
							await setMessageAsDeclined(message.context?.id || null);
						} else {
							try {
								await sendNoReplyMessage({ phoneNumber: message.from });
								console.log('Message sent to:', message.from);
							} catch (error) {
								console.error('Failed to send no reply message:', error);
							}
						}
					}
				}

				const statuses = change.value.statuses || [];
				for (const status of statuses) {
					if (status.status === 'read') {
						await setMessageAsSeen(status.id);
					} else if (status.status === 'delivered') {
						await setMessageAsDelivered(status.id);
					} else if (status.status === 'failed') {
						await setMessageAsFailed(status.id);
					}
				}
			}
		}
		return NextResponse.json({ status: 'ok' });
	} catch (error) {
		console.error('Webhook error:', error);
		await sendErrorNotification(`Webhook error`, `${error}`);
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
	}
}

// Verify webhook subscription
export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const mode = searchParams.get('hub.mode');
	const token = searchParams.get('hub.verify_token');
	const challenge = searchParams.get('hub.challenge');

	// Replace with your actual verify token
	const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

	if (mode === 'subscribe' && token === VERIFY_TOKEN) {
		return new Response(challenge, { status: 200 });
	}

	return new Response('Forbidden', { status: 403 });
}
