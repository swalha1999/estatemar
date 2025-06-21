import { eq, asc, desc, or, sql, ilike } from 'drizzle-orm';
import { developers, type Developer } from '@/data/access-layer-v2/schemas/developer.schema';
import { BaseRepository } from './base';
import { developerInterfaceSelect } from '../interfaces/developer.interface';

export class DevelopersRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...developerInterfaceSelect,
			}
		).from(developers).orderBy(asc(developers.id));
	}

	async findWithPagination(sort: 'asc' | 'desc', page: number, limit: number) {
		return await this.db.select(
			{
				...developerInterfaceSelect,
			}
		).from(developers).orderBy(sort === 'asc' ? asc(developers.id) : desc(developers.id)).limit(limit).offset((page - 1) * limit);
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...developerInterfaceSelect,
			}
		).from(developers).where(eq(developers.id, id));
	}

	async findByEmail(email: string) {
		return await this.db.select(
			{
				...developerInterfaceSelect,
			}
		).from(developers).where(eq(developers.email, email));
	}

	async create(data: Omit<Developer, 'id' | 'createdAt' | 'updatedAt'>) {
		return await this.db.insert(developers).values({
			...data,
			createdAt: new Date(),
			updatedAt: new Date(),
		}).returning();
	}

	async update(id: number, data: Partial<Omit<Developer, 'id' | 'createdAt'>>) {
		return await this.db.update(developers).set({
			...data,
			updatedAt: new Date(),
		}).where(eq(developers.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(developers).where(eq(developers.id, id));
	}

	async search(query: string) {
		return await this.db.select(
			{
				...developerInterfaceSelect,
			}
		).from(developers).where(
			or(
				ilike(developers.name, `%${query}%`),
				ilike(developers.email, `%${query}%`),
				ilike(developers.companyInfo, `%${query}%`)
			)
		);
	}

	async count() {
		return await this.db.select({ count: sql<number>`count(*)` }).from(developers);
	}
} 