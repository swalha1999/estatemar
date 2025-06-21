import { contacts, households, type Household } from '@/db/schema-auth';
import { and, asc, eq } from 'drizzle-orm';
import { householdInterfaceSelect } from '../interfaces/household.interface';
import { BaseRepository } from './base';
import { ContactsRepository } from './contacts.repository';

export class HouseholdsRepository extends BaseRepository {
	private contactsRepo = new ContactsRepository();

	async getAll() {
		return await this.db.select(
			{
				...householdInterfaceSelect,
			}
		).from(households).orderBy(asc(households.id));
	}

	async getAllWithContacts() {
		return await this.db.query.households.findMany({
			with: {
				contacts: {
					with: {
						family: true,
					},
					orderBy: [asc(contacts.personalNumber)],
				},
			},
		});
	}

	async getAllPaginated(page: number, limit: number) {
		return await this.db.select(
			{
				...householdInterfaceSelect,
			}
		).from(households).orderBy(asc(households.id)).limit(limit).offset((page - 1) * limit);
	}

	async findByAddress(homeNumber: number, street: string, town: string) {
		return await this.db.select(
			{
				...householdInterfaceSelect,
			}
		).from(households).where(and(
			eq(households.number, homeNumber),
			eq(households.street, street),
			eq(households.town, town)
		));
	}

	async create(homeNumber: number, street: string, town: string) {
		return await this.db
			.insert(households)
			.values({
				number: homeNumber,
				street,
				town,
			})
			.returning();
	}

	async update(id: number, data: Partial<Household>) {
		return await this.db.update(households).set(data).where(eq(households.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(households).where(eq(households.id, id));
	}

	async getById(id: number) {
		return await this.db.select(
			{
				...householdInterfaceSelect,
			}
		).from(households).where(eq(households.id, id));
	}

	async getUniqueTowns() {
		const result = await this.db
			.selectDistinct({ town: households.town })
			.from(households)
			.orderBy(asc(households.town));
		return result.map(r => r.town);
	}

	async getUniqueStreets(townFilter?: string) {
		const query = this.db
			.selectDistinct({ street: households.street })
			.from(households)
			.orderBy(asc(households.street));

		if (townFilter) {
			query.where(eq(households.town, townFilter));
		}

		const result = await query;
		return result.map(r => r.street);
	}

	// Delete households that have no members (contacts)
	async cleanHouseholds() {
		const households = await this.getAll();
		for (const household of households) {
			const contacts = await this.contactsRepo.getContactsByHousehold(household.id);
			if (contacts.length === 0) {
				await this.delete(household.id);
			}
		}
	}
} 