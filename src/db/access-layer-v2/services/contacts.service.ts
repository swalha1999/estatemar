import { ContactsRepository, HouseholdsRepository } from '../repositories';
import { type ContactSearchParams, type ConsentStatus } from '../interfaces/contact.interface';
import { BaseService } from './base.service';
import { type Contact } from '@/db/schema-auth';
import { cache } from 'react';

export class ContactsService extends BaseService {
	private contactsRepo = new ContactsRepository();
	private householdsRepo = new HouseholdsRepository();

	async getAllContacts() {
		return await this.contactsRepo.findAll();
	}

	getAllContactsForAdmin = cache(
		async (
			searchParams?: ContactSearchParams,
		) => {
			await this.requireAdmin();
			return await this.contactsRepo.findWithFilters(searchParams);
		}
	);

	getContactsStats = cache(
		async (
			searchParams?: ContactSearchParams,
		) => {
			await this.requireAdmin();
			return await this.contactsRepo.getStats(searchParams);
		}
	);

	async getAllHouseholdsWithContacts() {
		await this.requireAdmin();
		return await this.householdsRepo.getAllWithContacts();
	}

	async getContactById(id: number) {
		return await this.contactsRepo.findById(id);
	}

	async getContactByPhoneNumber(phoneNumber: string) {
		return await this.contactsRepo.findByPhoneNumber(phoneNumber);
	}

	async getContactsByHousehold(householdId: number) {
		return await this.contactsRepo.findByHousehold(householdId);
	}

	async getContactsByAddedBy() {
		const { user } = await this.requireAuth();
		return await this.contactsRepo.findByAddedBy(user.id);
	}

	async getContactsWithFilters(
		searchParams?: ContactSearchParams
	) {
		await this.requireAdmin();
		return await this.contactsRepo.findWithFilters(searchParams);
	}

	async getContactsCount(
		searchParams?: ContactSearchParams
	) {
		await this.requireAdmin();
		return await this.contactsRepo.countWithFilters(searchParams);
	}

	async createContact(data: Omit<Contact, 'id' | 'approvedAt' | 'approvedBy' | 'contactConsentAt' | 'optOutAt' | 'concentMessageSent'>) {
		await this.requireAdmin();
		
		const result = await this.contactsRepo.create(data);
		
		return result;
	}

	async updateContact(id: number, data: Partial<Contact>) {
		await this.requireAdmin();
		
		const result = await this.contactsRepo.update(id, data);
		
		return result;
	}

	async deleteContact(id: number) {
		await this.requireAdmin();
		
		const result = await this.contactsRepo.delete(id);
		
		return result;
	}

	async updateContactConsent(id: number, consent: boolean) {
		const { user } = await this.requireAuth();
		
		const updateData: Partial<Contact> = {
			contactConsent: consent,
			contactConsentAt: consent ? new Date() : null,
		};
		
		const result = await this.contactsRepo.update(id, updateData);
		
		return result;
	}

	async updateContactOptOut(id: number, optOut: boolean) {
		const { user } = await this.requireAuth();
		
		const updateData: Partial<Contact> = {
			optOut,
			optOutAt: optOut ? new Date() : null,
		};
		
		const result = await this.contactsRepo.update(id, updateData);
		
		return result;
	}

	async getUniqueTowns() {
		return await this.contactsRepo.findUniqueTowns();
	}

	async getUniqueStreets() {
		return await this.contactsRepo.findUniqueStreets();
	}

	async getUniqueStreetsForTown(town: string) {
		return await this.contactsRepo.findUniqueStreetsForTown(town);
	}

	async getUniqueTownsWithApprovedContacts() {
		return await this.contactsRepo.findUniqueTownsWithApprovedContacts();
	}

	async getUniqueStreetsWithApprovedContacts(town?: string) {
		return await this.contactsRepo.findUniqueStreetsWithApprovedContacts(town);
	}

	async getAllHouseholds() {
		return await this.householdsRepo.getAll();
	}

	async getHouseholdById(id: number) {
		return await this.householdsRepo.getById(id);
	}

	async getOrCreateHousehold(homeNumber: number, street: string, town: string) {
		const households = await this.householdsRepo.findByAddress(homeNumber, street, town);
		if (households.length === 0) {
			const result = await this.householdsRepo.create(homeNumber, street, town);
			return result[0];
		}
		return households[0];
	}

	async bulkUpdateApproval(approved: boolean, searchParams?: ContactSearchParams) {
		await this.requireSuperAdmin();
		
		return await this.contactsRepo.bulkUpdateApproval(approved, searchParams);
	}
} 