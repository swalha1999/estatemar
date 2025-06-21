import { contacts, families, households, Contact, Family, Household } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

export type ConsentStatus =
	| 'gave_consent'
	| 'no_response'
	| 'declined'
	| 'concent_message_not_sent'
	| 'concent_message_failed';


/**
 * Interface for the contact table
 * @description This interface is used to define the structure of the contact table
 * @returns {Object} The interface for the contact table with the following fields:
 * @returns {number} id - The id of the contact
 * @returns {string} firstName - The first name of the contact
 * @returns {string} middleName - The middle name of the contact
 * @returns {string} previousFamilyName - The previous family name of the contact
 * @returns {number} birthYear - The birth year of the contact
 * @returns {string} gender - The gender of the contact
 * @returns {string} phone - The phone number of the contact
 * @returns {number} personalNumber - The personal number of the contact
 */
export const contactInterfaceSelect = {
    id: contacts.id,
    title: contacts.title,
    firstName: contacts.firstName,
    middleName: contacts.middleName,
    previousFamilyName: contacts.previousFamilyName,
    birthYear: contacts.birthYear,
    gender: contacts.gender,
    phone: contacts.phone,
    personalNumber: contacts.personalNumber,
    householdId: households.id,
    home: households.number,
    street: households.street,
    town: households.town,
    familyId: families.id,
    familyName: families.name,
    consent: contacts.contactConsent,
    optOut: contacts.optOut,
    optOutAt: contacts.optOutAt,
    concentMessageSent: contacts.concentMessageSent,
    concentMessageFailed: contacts.concentMessageFailed,
    contactConsentAt: contacts.contactConsentAt,
}

export interface ContactInterface {
    id: Contact['id'];
    title: Contact['title'];
    firstName: Contact['firstName'];
    middleName: Contact['middleName'];
    previousFamilyName: Contact['previousFamilyName'];
    birthYear: Contact['birthYear'];
    gender: Contact['gender'];
    phone: Contact['phone'];
    personalNumber: Contact['personalNumber'];
    householdId: Household['id'] | null;
    home: Household['number'] | null;
    street: Household['street'] | null;
    town: Household['town'] | null;
    familyId: Family['id'] | null;
    familyName: Family['name'] | null;
    consent: Contact['contactConsent'];
    optOut: Contact['optOut'];
    optOutAt: Contact['optOutAt'];
    concentMessageSent: Contact['concentMessageSent'];
    concentMessageFailed: Contact['concentMessageFailed'];
    contactConsentAt: Contact['contactConsentAt'];
}

export interface ContactSearchParams extends BaseSearchParams {
	gender?: Contact['gender'];
	title?: Contact['title'];
	birthYear?: Contact['birthYear'];
	firstName?: Contact['firstName'];
	middleName?: Contact['middleName'];
	family?: Family['name'];
	previousFamilyName?: Contact['previousFamilyName'];
	phone?: Contact['phone'];
	town?: Household['town'];
	personalNumber?: Contact['personalNumber'];
	home?: Household['number'];
	street?: Household['street'];
	consentStatus?: ConsentStatus;
	approved?: string;
}
