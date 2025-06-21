import { whatsapp_messages, contacts, WhatsAppMessage, Contact } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the whatsapp_messages table
 * @description This interface is used to define the structure of the whatsapp_messages table
 * @returns {Object} The interface for the whatsapp_messages table with the following fields:
 */
export const whatsappInterfaceSelect = {
    id: whatsapp_messages.id,
    message_id: whatsapp_messages.message_id,
    contactId: whatsapp_messages.contactId,
    inviteId: whatsapp_messages.inviteId,
    message_template: whatsapp_messages.message_template,
    message_sent: whatsapp_messages.message_sent,
    message_delivered: whatsapp_messages.message_delivered,
    message_read: whatsapp_messages.message_read,
    message_failed: whatsapp_messages.message_failed,
    message_content: whatsapp_messages.message_content,
    phone: whatsapp_messages.phone,
    approved: whatsapp_messages.approved,
    declined: whatsapp_messages.declined,
    sentAt: whatsapp_messages.sentAt,
    deliveredAt: whatsapp_messages.deliveredAt,
    readAt: whatsapp_messages.readAt,
    // Contact fields from join
    firstName: contacts.firstName,
    contactPhone: contacts.phone,
}

export type WhatsAppInterface = {
    id: WhatsAppMessage['id'];
    message_id: WhatsAppMessage['message_id'];
    contactId: WhatsAppMessage['contactId'];
    inviteId: WhatsAppMessage['inviteId'];
    message_template: WhatsAppMessage['message_template'];
    message_sent: WhatsAppMessage['message_sent'];
    message_delivered: WhatsAppMessage['message_delivered'];
    message_read: WhatsAppMessage['message_read'];
    message_failed: WhatsAppMessage['message_failed'];
    message_content: WhatsAppMessage['message_content'];
    phone: WhatsAppMessage['phone'];
    approved: WhatsAppMessage['approved'];
    declined: WhatsAppMessage['declined'];
    sentAt: WhatsAppMessage['sentAt'];
    deliveredAt: WhatsAppMessage['deliveredAt'];
    readAt: WhatsAppMessage['readAt'];
    firstName: Contact['firstName'];
    contactPhone: Contact['phone'];
}

export interface WhatsAppSearchParams extends BaseSearchParams {
    message_id?: WhatsAppMessage['message_id'];
    contactId?: WhatsAppMessage['contactId'];
    inviteId?: WhatsAppMessage['inviteId'];
    message_template?: WhatsAppMessage['message_template'];
    message_sent?: WhatsAppMessage['message_sent'];
    message_delivered?: WhatsAppMessage['message_delivered'];
    message_read?: WhatsAppMessage['message_read'];
    message_failed?: WhatsAppMessage['message_failed'];
    message_content?: WhatsAppMessage['message_content'];
    phone?: WhatsAppMessage['phone'];
    approved?: WhatsAppMessage['approved'];
    declined?: WhatsAppMessage['declined'];
    sentAt?: WhatsAppMessage['sentAt'];
    deliveredAt?: WhatsAppMessage['deliveredAt'];
    readAt?: WhatsAppMessage['readAt'];
}