import { and, asc, count, eq, like, or, SQL, sql, inArray } from 'drizzle-orm';
import { contacts, households, type Contact, families } from '@/db/schema-auth';
import { BaseRepository } from './base';
import { contactInterfaceSelect, type ConsentStatus, type ContactSearchParams } from '../interfaces/contact.interface';
import { cache } from 'react';

export class ContactsRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).leftJoin(households, eq(contacts.householdId, households.id)).leftJoin(families, eq(contacts.familyId, families.id)).orderBy(asc(contacts.id));
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).leftJoin(households, eq(contacts.householdId, households.id)).leftJoin(families, eq(contacts.familyId, families.id)).where(eq(contacts.id, id));
	}

	async findByPhoneNumber(phoneNumber: string) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).leftJoin(households, eq(contacts.householdId, households.id)).leftJoin(families, eq(contacts.familyId, families.id)).where(eq(contacts.phone, phoneNumber));
	}

	async findByHousehold(householdId: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).leftJoin(households, eq(contacts.householdId, households.id)).leftJoin(families, eq(contacts.familyId, families.id)).where(eq(contacts.householdId, householdId));
	}

	async findByAddedBy(userId: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).leftJoin(households, eq(contacts.householdId, households.id)).leftJoin(families, eq(contacts.familyId, families.id)).where(eq(contacts.addedBy, userId)).orderBy(asc(contacts.id));
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
		if (searchParams.previousFamilyName) {
			conditions.push(like(contacts.previousFamilyName, `%${searchParams.previousFamilyName}%`));
		}
		if (searchParams.phone) {
			conditions.push(like(contacts.phone, `%${searchParams.phone}%`));
		}
		if (searchParams.personalNumber) {
			conditions.push(eq(contacts.personalNumber, searchParams.personalNumber));
		}
		if (searchParams.family) {
			conditions.push(like(families.name, `%${searchParams.family}%`));
		}
		if (searchParams.town) {
			conditions.push(like(households.town, `%${searchParams.town}%`));
		}
		if (searchParams.street) {
			conditions.push(like(households.street, `%${searchParams.street}%`));
		}
		if (searchParams.home) {
			conditions.push(sql`${households.number}::text LIKE ${`%${searchParams.home}%`}`);
		}
		if (searchParams.consentStatus) {
			conditions.push(this.getConsentFilter(searchParams.consentStatus));
		}
		if (searchParams.approved === 'true') {
			conditions.push(eq(contacts.approved, true));
		}
		if (searchParams.approved === 'false') {
			conditions.push(eq(contacts.approved, false));
		}
		if (searchParams.gender) {
			conditions.push(eq(contacts.gender, searchParams.gender));
		}	
		if (searchParams.birthYear) {
			conditions.push(eq(contacts.birthYear, searchParams.birthYear));
		}

		return conditions.length > 0 ? and(...conditions) : undefined;
	})

	private getConsentFilter(status: ConsentStatus) {
		switch (status) {
			case 'gave_consent':
				return eq(contacts.contactConsent, true);
			case 'declined':
				return eq(contacts.optOut, true);
			case 'concent_message_failed':
				return eq(contacts.concentMessageFailed, true);
			case 'concent_message_not_sent':
				return and(
					eq(contacts.contactConsent, false),
					eq(contacts.concentMessageSent, false),
					eq(contacts.concentMessageFailed, false)
				);
			case 'no_response':
				return and(
					eq(contacts.contactConsent, false),
					eq(contacts.concentMessageSent, true),
					eq(contacts.concentMessageFailed, false),
					eq(contacts.optOut, false)
				);
			default:
				return undefined;
		}
	}

	async findWithFilters(
		searchParams?: ContactSearchParams
	) {
		const whereClause = this.serachParamsToConditions(searchParams);
		// Get total count
		const totalResult = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
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
				previousFamilyName: contacts.previousFamilyName,
				phone: contacts.phone,
				personalNumber: contacts.personalNumber,
				contactConsent: contacts.contactConsent,
				optOut: contacts.optOut,
				concentMessageSent: contacts.concentMessageSent,
				concentMessageFailed: contacts.concentMessageFailed,
				contactConsentAt: contacts.contactConsentAt,
				optOutAt: contacts.optOutAt,
				approved: contacts.approved,
				approvedAt: contacts.approvedAt,
				approvedBy: contacts.approvedBy,
				addedBy: contacts.addedBy,
				householdId: contacts.householdId,
				familyId: contacts.familyId,
				household: {
					id: households.id,
					number: households.number,
					street: households.street,
					town: households.town,
				},
				family: {
					id: families.id,
					name: families.name,
				},
			})
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(whereClause)
			.orderBy(asc(households.number), asc(contacts.personalNumber))
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
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(whereClause);

		return result[0]?.count || 0;
	}

	async create(data: Omit<Contact, 'id' | 'approvedAt' | 'approvedBy' | 'contactConsentAt' | 'optOutAt' | 'concentMessageSent'>) {
		return await this.db.insert(contacts).values(data).returning();
	}

	async update(id: number, data: Partial<Contact>) {
		return await this.db.update(contacts).set(data).where(eq(contacts.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(contacts).where(eq(contacts.id, id));
	}

	async bulkUpdateApproval(approved: boolean, searchParams?: ContactSearchParams) {
		// First, get the IDs of contacts that match the search criteria
		const whereClause = this.serachParamsToConditions(searchParams);
		
		const matchingContacts = await this.db
			.select({ id: contacts.id })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(whereClause);

		const ids = matchingContacts.map(contact => contact.id);

		if (ids.length === 0) {
			return { count: 0 };
		}

		// Bulk update the matched contacts
		const result = await this.db
			.update(contacts)
			.set({ 
				approved,
				approvedAt: approved ? new Date() : null 
			})
			.where(inArray(contacts.id, ids))
			.returning({ id: contacts.id });

		return { count: result.length };
	}

	async findUniqueTowns() {
		return await this.db
			.selectDistinct({ town: households.town })
			.from(households)
			.where(sql`${households.town} IS NOT NULL`)
			.orderBy(asc(households.town));
	}

	async findUniqueStreets() {
		return await this.db
			.selectDistinct({ street: households.street })
			.from(households)
			.where(sql`${households.street} IS NOT NULL`)
			.orderBy(asc(households.street));
	}

	async findUniqueStreetsForTown(town: string) {
		return await this.db
			.selectDistinct({ street: households.street })
			.from(households)
			.where(and(
				eq(households.town, town),
				sql`${households.street} IS NOT NULL`
			))
			.orderBy(asc(households.street));
	}

	async findUniqueTownsWithApprovedContacts() {
		return await this.db
			.selectDistinct({ town: households.town })
			.from(households)
			.innerJoin(contacts, eq(households.id, contacts.householdId))
			.where(eq(contacts.approved, true))
			.orderBy(asc(households.town));
	}

	async findUniqueStreetsWithApprovedContacts(town?: string) {
		const conditions = [eq(contacts.approved, true)];
		if (town) {
			conditions.push(eq(households.town, town));
		}

		return await this.db
			.selectDistinct({ street: households.street })
			.from(households)
			.innerJoin(contacts, eq(households.id, contacts.householdId))
			.where(and(...conditions))
			.orderBy(asc(households.street));
	}

	async getContactsByHousehold(householdId: number) {
		return await this.db.select(
			{
				...contactInterfaceSelect,
			}
		).from(contacts).where(eq(contacts.householdId, householdId));
	}

	private async getTotalContacts(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(whereClause);
		return result[0]?.count || 0;
	}

	private async getTotalHouseholds(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.selectDistinct({ id: households.id })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(whereClause);
		return result.length;
	}

	private async getTotalOptedIn(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(and(whereClause || undefined, eq(contacts.contactConsent, true)));
		return result[0]?.count || 0;
	}

	private async getTotalDeclined(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(and(whereClause || undefined, eq(contacts.optOut, true)));
		return result[0]?.count || 0;
	}

	private async getTotalDidntRespond(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(
				and(
					whereClause || undefined,
					eq(contacts.contactConsent, false),
					eq(contacts.concentMessageSent, true),
					eq(contacts.concentMessageFailed, false),
					eq(contacts.optOut, false)
				)
			);
		return result[0]?.count || 0;
	}

	private async getTotalFailed(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(and(whereClause || undefined, eq(contacts.concentMessageFailed, true)));
		return result[0]?.count || 0;
	}

	private async getTotalDidntSend(searchParams?: ContactSearchParams) {
		const whereClause = this.serachParamsToConditions(searchParams);
		const result = await this.db
			.select({ count: count() })
			.from(contacts)
			.leftJoin(households, eq(contacts.householdId, households.id))
			.leftJoin(families, eq(contacts.familyId, families.id))
			.where(
				and(
					whereClause || undefined,
					eq(contacts.contactConsent, false),
					eq(contacts.concentMessageSent, false),
					eq(contacts.concentMessageFailed, false)
				)
			);
		return result[0]?.count || 0;
	}

	async getStats(searchParams?: ContactSearchParams) {
		const [
			totalContacts,
			totalHouseholds,
			totalOptedIn,
			totalDeclined,
			totalDidntRespond,
			totalFailed,
			totalDidntSend,
		] = await Promise.all([
			this.getTotalContacts(searchParams),
			this.getTotalHouseholds(searchParams),
			this.getTotalOptedIn(searchParams),
			this.getTotalDeclined(searchParams),
			this.getTotalDidntRespond(searchParams),
			this.getTotalFailed(searchParams),
			this.getTotalDidntSend(searchParams),
		]);

		return {
			totalContacts,
			totalHouseholds,
			totalOptedIn,
			totalDeclined,
			totalDidntRespond,
			totalFailed,
			totalDidntSend,
		};
	}
}