import { and, asc, count, eq, like, or, SQL, sql, inArray } from 'drizzle-orm';
import { contacts, type Contact } from '@/data/access-layer-v2/schemas/contact.schema';
import { BaseRepository } from './base';
import { contactInterfaceSelect, type ConsentStatus, type ContactSearchParams } from '../interfaces/contact.interface';
import { cache } from 'react';

export class ContactsRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).orderBy(asc(contacts.id));
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).where(eq(contacts.id, id));
	}

	async findByPhoneNumber(phoneNumber: string) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).where(eq(contacts.phone, phoneNumber));
	}


	async findByAddedBy(userId: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).where(eq(contacts.addedBy, userId)).orderBy(asc(contacts.id));
	}

	private serachParamsToConditions = cache((searchParams?: ContactSearchParams) => {
		const conditions = [];

		if (!searchParams) {
			return undefined;
		}
		if (searchParams.firstName) {
			conditions.push(like(contacts.firstName, `%${searchParams.firstName}%`));
		}
		if (searchParams.middleName) {
			conditions.push(like(contacts.middleName, `%${searchParams.middleName}%`));
		}
		if (searchParams.lastName) {
			conditions.push(like(contacts.lastName, `%${searchParams.lastName}%`));
		}
		if (searchParams.phone) {
			conditions.push(like(contacts.phone, `%${searchParams.phone}%`));
		}
		if (searchParams.passportNumber) {
			conditions.push(eq(contacts.passportNumber, searchParams.passportNumber));
		}
		if (searchParams.addedBy) {
			conditions.push(eq(contacts.addedBy, searchParams.addedBy));
		}
	
		return conditions.length > 0 ? and(...conditions) : undefined;
	})

	async findWithFilters(
		searchParams?: ContactSearchParams
	) {
		const whereClause = this.serachParamsToConditions(searchParams);
		// Get total count
		const totalResult = await this.db
			.select({ count: count() })
			.from(contacts)
			.where(whereClause);

		const total = totalResult[0]?.count || 0;

		// Get paginated results
		const contactsResult = await this.db
			.select({
				id: contacts.id,
				gender: contacts.gender,
				birthYear: contacts.birthYear,
				firstName: contacts.firstName,
				middleName: contacts.middleName,
				lastName: contacts.lastName,
				phone: contacts.phone,
				passportNumber: contacts.passportNumber,
				addedBy: contacts.addedBy,
			})
			.from(contacts)
			.where(whereClause)
			.orderBy(asc(contacts.id))
			.limit(searchParams?.limit ? parseInt(searchParams.limit) : 100)
			.offset(((searchParams?.page ? parseInt(searchParams.page) : 1) - 1) * (searchParams?.limit ? parseInt(searchParams.limit) : 100));

		return {
			contacts: contactsResult,
			total,
		};
	}

	async countWithFilters(
		searchParams?: ContactSearchParams
	) {
		const whereClause = this.serachParamsToConditions(searchParams);

		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.where(whereClause);

		return result[0]?.count || 0;
	}

	async create(data: Omit<Contact, 'id' | 'createdAt' >) {
		return await this.db.insert(contacts).values(data).returning();
	}

	async update(id: number, data: Partial<Contact>) {
		return await this.db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(contacts).where(eq(contacts.id, id));
	}

	
	private async getTotalContacts(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.where(whereClause);
		return result[0]?.count || 0;
	}

}