import { LeadsRepository } from '../repositories';
import { BaseService } from './base.service';
import { type Lead } from '@/db/schema-auth';

export class LeadsService extends BaseService {
	private leadsRepo = new LeadsRepository();

	async getAllLeads() {
		await this.requireAdmin();
		return await this.leadsRepo.findAll();
	}

	async getLeadById(id: number) {
		await this.requireAdmin();
		return await this.leadsRepo.findById(id);
	}

	async createLead(data: Omit<Lead, 'id' | 'createdAt'>) {
		const result = await this.leadsRepo.create(data);
		
		return result;
	}

	async updateLead(id: number, data: Partial<Lead>) {
		await this.requireAdmin();
		
		const result = await this.leadsRepo.update(id, data);
		
		return result;
	}

	async deleteLead(id: number) {
		await this.requireAdmin();
		
		const result = await this.leadsRepo.delete(id);
		
		return result;
	}
} 