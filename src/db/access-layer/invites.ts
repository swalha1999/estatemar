import { db } from '@/db';
import { invites, Invite, WhatsAppMessage, whatsapp_messages, Contact, contacts } from '@/db/schema-auth';
import { eq } from 'drizzle-orm';
import { sendInviteWhatsAppMessage } from '@/lib/whatsapp/index';
import { sendKeranInviteMessage } from '@/lib/whatsapp/templates/keran_invite';
import { getFullName } from '@/utils/string';
import { getSignedUrlForDownload } from '@/lib/storage/r2';
import { getFileById } from './files';
import { sendHallInviteMessage } from '@/lib/whatsapp/templates/hall_invite';

export type InviteWithMessages = NonNullable<Awaited<ReturnType<typeof getAllPendingInvitationsForAdmin>>>[number];
export type InviteWithMessagesAndContacs = NonNullable<Awaited<ReturnType<typeof getInvitationByIdWithMsgs>>> | undefined;

export async function getInvitationByIdWithMsgs(Id: number) {
    return await db.query.invites.findFirst({
        where: eq(invites.id, Id),
        with: {
            whatsappMessages: {
                with: {
                    contact: true
                }
            },
            
        }
    });
}

export async function deleteInvitation(invite: Invite) {
    return await db.delete(invites).where(eq(invites.id, invite.id));
}

export async function getAllPendingInvitationsForAdmin() {

    const validInvites = await db.query.invites.findMany({
        with: {
            whatsappMessages: true,
            user: true
        }
    });

    return validInvites;
}

export async function approveWhatsappMsg(invite: Invite) {
    return await db.update(invites).set({AdminApproved: !invite.AdminApproved}).where(eq(invites.id, invite.id));
}

export async function sendWhatsappMsg(invitation: Invite, whatsAppMessage: WhatsAppMessage, contact: Contact, ignoreSent: boolean = false) {
    if (whatsAppMessage.message_sent && !ignoreSent) {
        return true;
    }
    let msgId: string | null = null;
    const contactWithFamily = await getContactWithFamily(contact);
    const imageKey = invitation.weddingCardFileId? (await getFileById(invitation.weddingCardFileId))?.fileName : null;
	const imageLink = imageKey ? await getSignedUrlForDownload(imageKey) : '';

    if (!imageLink) {
        throw new Error('No image link found');
    }

    switch (invitation.whatsappTemplate) {
        case 'hall_invite':
            msgId = await sendHallInviteMessage({
                recipientName: getFullName(contactWithFamily),
                inviterName: invitation.inviter || '',
                coupleName: `${invitation.groomName} و${invitation.brideName}`,
                hallLocation: invitation.location,
                date: invitation.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric', 
                    day: 'numeric'
                }),
                time: invitation.date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                phoneNumber: contact.phone || '',
                imageUrl: imageLink,
                whatsappMessageId: whatsAppMessage.id.toString()
            });
            break;
        case 'home_invite':
            msgId = await sendInviteWhatsAppMessage(invitation, contact);
            break;
        case 'keran_invite':
            msgId = await sendKeranInviteMessage({
                recipientName: getFullName(contactWithFamily),
                inviterName: invitation.inviter || '',
                groomName: invitation.groomName,
                date: invitation.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'numeric', 
                    day: 'numeric'
                }),
                time: invitation.date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                phoneNumber: contact.phone || '',
                imageUrl: imageLink,
            });
            break;
        default:
            throw new Error('Invalid WhatsApp template');
    }
    if (!msgId) {
        return false;
    }
    return await db.update(whatsapp_messages).set({message_sent: true, sentAt: new Date(), message_id: msgId}).where(eq(whatsapp_messages.id, whatsAppMessage.id));
}

export async function getContactWithFamily(contact  : Contact) {
    return await db.query.contacts.findFirst({
        where: eq(contacts.id, contact.id),
        with: {
            family: true,
            household: true
        }
    });
}