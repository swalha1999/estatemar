import { FamiliesRepository } from '../repositories';
import { BaseService } from './base.service';
import { cache } from 'react';

export class FamiliesService extends BaseService {
	private familiesRepo = new FamiliesRepository();

	async getAllFamilies() {
		await this.requireAdmin();
		return await this.familiesRepo.findAll();
	}

	async getFamilyById(id: number) {
		return await this.familiesRepo.findById(id);
	}

	async getFamilyByName(name: string) {
		return await this.familiesRepo.findByName(name);
	}

	async createFamily(name: string) {
		await this.requireAdmin();
		
		const result = await this.familiesRepo.create(name);
		return result;
	}

	async getOrCreateFamily(name: string) {
		await this.requireAdmin();
		
		const existingFamily = await this.familiesRepo.findByName(name);
		if (existingFamily) {
			return existingFamily;
		}
		
		const result = await this.familiesRepo.create(name);
		return result[0];
	}

	async deleteFamily(id: number) {
		await this.requireAdmin();
		
		const result = await this.familiesRepo.delete(id);
		
		return result;
	}

	getUniqueFamilies = cache(async () => {
		await this.requireAdmin();
		return await this.familiesRepo.getUniqueFamilies();
	});
} 