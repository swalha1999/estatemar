import { eq, desc, asc } from 'drizzle-orm';
import { leads, type Lead } from '@/db/schema-auth';
import { BaseRepository } from './base';
import { leadInterfaceSelect } from '../interfaces/lead.interface';

export class LeadsRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...leadInterfaceSelect,
			}
		).from(leads).orderBy(desc(leads.createdAt));
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...leadInterfaceSelect,
			}
		).from(leads).where(eq(leads.id, id));
	}

	async create(data: Omit<Lead, 'id' | 'createdAt'>) {
		return await this.db.insert(leads).values(data).returning();
	}

	async update(id: number, data: Partial<Lead>) {
		return await this.db.update(leads).set(data).where(eq(leads.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(leads).where(eq(leads.id, id));
	}
} 