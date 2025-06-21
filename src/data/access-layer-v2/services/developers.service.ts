import { DevelopersRepository } from '../repositories/developers.repository';
import { BaseService } from './base.service';
import { type Developer } from '@/data/access-layer-v2/schemas/developer.schema';

export class DevelopersService extends BaseService {
	private developersRepo = new DevelopersRepository();

	async getAllDevelopers() {
		await this.requireAdmin();
		return await this.developersRepo.findAll();
	}

	async getDevelopersWithPagination(sort: 'asc' | 'desc', page: number, limit: number) {
		await this.requireAdmin();
		return await this.developersRepo.findWithPagination(sort, page, limit);
	}

	async getDeveloperById(id: number) {
		await this.requireAdmin();
		return await this.developersRepo.findById(id);
	}

	async getDeveloperByEmail(email: string) {
		await this.requireAdmin();
		return await this.developersRepo.findByEmail(email);
	}

	async createDeveloper(data: Omit<Developer, 'id' | 'createdAt' | 'updatedAt'>) {
		await this.requireAdmin();
		
		// Check if developer with same email already exists
		const existingDeveloper = await this.developersRepo.findByEmail(data.email);
		if (existingDeveloper.length > 0) {
			throw new Error('Developer with this email already exists');
		}
		
		const result = await this.developersRepo.create(data);
		
		return result;
	}

	async updateDeveloper(id: number, data: Partial<Omit<Developer, 'id' | 'createdAt'>>) {
		await this.requireAdmin();
		
		// Check if developer exists
		const existingDeveloper = await this.developersRepo.findById(id);
		if (!existingDeveloper.length) {
			throw new Error('Developer not found');
		}

		// If email is being updated, check for duplicates
		if (data.email) {
			const duplicateCheck = await this.developersRepo.findByEmail(data.email);
			if (duplicateCheck.length > 0 && duplicateCheck[0].id !== id) {
				throw new Error('Developer with this email already exists');
			}
		}
		
		const result = await this.developersRepo.update(id, data);
		
		return result;
	}

	async deleteDeveloper(id: number) {
		await this.requireAdmin();
		
		// Check if developer exists
		const existingDeveloper = await this.developersRepo.findById(id);
		if (!existingDeveloper.length) {
			throw new Error('Developer not found');
		}

		// TODO: Check if developer has properties linked (when properties table exists)
		// const propertiesCount = await this.propertiesRepo.countByDeveloperId(id);
		// if (propertiesCount > 0) {
		// 	throw new Error('Cannot delete developer with linked properties');
		// }
		
		const result = await this.developersRepo.delete(id);
		
		return result;
	}

	async searchDevelopers(query: string) {
		await this.requireAdmin();
		return await this.developersRepo.search(query);
	}

	async getDevelopersCount() {
		await this.requireAdmin();
		return await this.developersRepo.count();
	}
} 