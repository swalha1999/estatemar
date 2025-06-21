import { eq, count, asc, sql } from 'drizzle-orm';
import { families, contacts, type Family } from '@/db/schema-auth';
import { BaseRepository } from './base';
import { familyInterfaceSelect } from '../interfaces/family.interface';
import { ContactInterface } from '../interfaces/contact.interface';

export class FamiliesRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...familyInterfaceSelect,
			}
		).from(families).orderBy(asc(families.id));
	}

	async findAllWithMemberCount() {
		return await this.db
			.select({
				id: families.id,
				name: families.name,
				memberCount: count(contacts.id),
			})
			.from(families)
			.leftJoin(contacts, eq(families.id, contacts.familyId))
			.groupBy(families.id, families.name);
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...familyInterfaceSelect,
			}
		).from(families).where(eq(families.id, id));
	}

	async findByName(name: string) {
		const result = await this.db.select(
			{
				...familyInterfaceSelect,
			}
		).from(families).where(eq(families.name, name));
		return result[0] || null;
	}

	async create(name: string) {
		return await this.db.insert(families).values({ name }).returning();
	}

	async update(id: number, data: Partial<Family>) {
		return await this.db.update(families).set(data).where(eq(families.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(families).where(eq(families.id, id));
	}

	async getUniqueFamilies() {
		const result = await this.db
			.selectDistinct({ name: families.name })
			.from(families)
			.orderBy(asc(families.name));
		return result.map(r => r.name);
	}
} 