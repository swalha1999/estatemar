import { HouseholdsRepository } from '../repositories';
import { BaseService } from './base.service';
import { type Household } from '@/db/schema-auth';
import { cache } from 'react';

export class HouseholdsService extends BaseService {
	private householdsRepo = new HouseholdsRepository();

	async getAll() {
		return await this.householdsRepo.getAll();
	}

	async getAllWithContacts() {
		return await this.householdsRepo.getAllWithContacts();
	}

	async getAllPaginated(page: number, limit: number) {
		return await this.householdsRepo.getAllPaginated(page, limit);
	}

	async findByAddress(homeNumber: number, street: string, town: string) {
		return await this.householdsRepo.findByAddress(homeNumber, street, town);
	}

	async create(homeNumber: number, street: string, town: string) {
		await this.requireAdmin();
		return await this.householdsRepo.create(homeNumber, street, town);
	}

	async update(id: number, data: Partial<Household>) {
		await this.requireAdmin();
		return await this.householdsRepo.update(id, data);
	}

	async delete(id: number) {
		await this.requireAdmin();
		return await this.householdsRepo.delete(id);
	}

	async getById(id: number) {
		return await this.householdsRepo.getById(id);
	}

	getUniqueTowns = cache(async () => {
		await this.requireAdmin();
		return await this.householdsRepo.getUniqueTowns();
	});

	getUniqueStreets = cache(async (townFilter?: string) => {
		await this.requireAdmin();
		return await this.householdsRepo.getUniqueStreets(townFilter);
	});
} 