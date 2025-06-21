import { ContactsRepository } from '../repositories';
import { type ContactSearchParams } from '../interfaces/contact.interface';
import { BaseService } from './base.service';
import { type Contact } from '@/data/access-layer-v2/schemas/contact.schema';
import { cache } from 'react';

export class ContactsService extends BaseService {
	private contactsRepo = new ContactsRepository();

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

	async getContactById(id: number) {
		return await this.contactsRepo.findById(id);
	}

	async getContactByPhoneNumber(phoneNumber: string) {
		return await this.contactsRepo.findByPhoneNumber(phoneNumber);
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

	async createContact(data: Omit<Contact, 'id' | 'createdAt' | 'addedBy'>) {
		const { user } = await this.requireAuth();
		return await this.contactsRepo.create({ ...data, addedBy: user.id || null } );
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
} 