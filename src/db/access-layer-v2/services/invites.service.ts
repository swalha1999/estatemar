import { InvitesRepository } from '../repositories';
import { BaseService } from './base.service';
import { type Invite } from '@/db/schema-auth';

export class InvitesService extends BaseService {
	private invitesRepo = new InvitesRepository();

	async getAllPendingInvitations() {
		await this.requireAdmin();
		return await this.invitesRepo.findAllWithMessages();
	}

	async getInviteById(id: number) {
		return await this.invitesRepo.findById(id);
	}

	async getInviteByIdWithMessages(id: number) {
		await this.requireAdmin();
		return await this.invitesRepo.findByIdWithMessages(id);
	}

	async createInvite(data: Omit<Invite, 'id'>) {
		await this.requireAuth();
		
		const result = await this.invitesRepo.create(data);
		
		return result;
	}

	async updateInvite(id: number, data: Partial<Invite>) {
		await this.requireAuth();
		
		const result = await this.invitesRepo.update(id, data);
		
		return result;
	}

	async deleteInvitation(invite: Invite) {
		await this.requireAdmin();
		
		const result = await this.invitesRepo.delete(invite.id);
		
		return result;
	}

	async approveInvitation(invite: Invite) {
		await this.requireAdmin();
		
		const result = await this.invitesRepo.approve(invite.id);
		
		return result;
	}
} 