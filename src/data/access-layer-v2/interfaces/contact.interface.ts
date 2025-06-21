import { contacts, Contact } from "@/data/access-layer-v2/schemas/contact.schema";
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
    lastName: contacts.lastName,
    birthYear: contacts.birthYear,
    gender: contacts.gender,
    phone: contacts.phone,
    passportNumber: contacts.passportNumber,
    addedBy: contacts.addedBy,
}

export interface ContactInterface {
    id: Contact['id'];
    title: Contact['title'];
    firstName: Contact['firstName'];
    middleName: Contact['middleName'];
    lastName: Contact['lastName'];
    birthYear: Contact['birthYear'];
    gender: Contact['gender'];
    phone: Contact['phone'];
    passportNumber: Contact['passportNumber'];
    addedBy: Contact['addedBy'];
}

export interface ContactSearchParams extends BaseSearchParams {
	gender?: Contact['gender'];
	title?: Contact['title'];
	birthYear?: Contact['birthYear'];
	firstName?: Contact['firstName'];
	middleName?: Contact['middleName'];
	lastName?: Contact['lastName'];
	phone?: Contact['phone'];
	passportNumber?: Contact['passportNumber'];
	addedBy?: Contact['addedBy'];
}
