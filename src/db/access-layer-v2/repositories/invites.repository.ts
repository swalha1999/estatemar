import { eq, asc } from 'drizzle-orm';
import { invites, users, files, whatsapp_messages, contacts, families, households, type Invite } from '@/db/schema-auth';
import { BaseRepository } from './base';
import { inviteInterfaceSelect } from '../interfaces/invite.interface';

export class InvitesRepository extends BaseRepository {
	async findAll() {
		return await this.db.select(
			{
				...inviteInterfaceSelect,
			}
		).from(invites).leftJoin(users, eq(invites.userId, users.id)).leftJoin(files, eq(invites.weddingCardFileId, files.id)).orderBy(asc(invites.id));
	}

	async findAllWithMessages() {
		return await this.db.select(
			{
				...inviteInterfaceSelect,
			}
		).from(invites).leftJoin(users, eq(invites.userId, users.id)).leftJoin(files, eq(invites.weddingCardFileId, files.id)).orderBy(asc(invites.id));
	}

	async findById(id: number) {
		return await this.db.select(
			{
				...inviteInterfaceSelect,
			}
		).from(invites).leftJoin(users, eq(invites.userId, users.id)).leftJoin(files, eq(invites.weddingCardFileId, files.id)).where(eq(invites.id, id));
	}

	async findByIdWithMessages(id: number) {
		return await this.db.query.invites.findFirst({
			where: eq(invites.id, id),
			with: {
				whatsappMessages: {
					with: {
						contact: {
							with: {
								family: true,
								household: true
							}
						}
					}
				},
				user: true,
				weddingCardFile: true
			}
		});
	}

	async create(data: Omit<Invite, 'id'>) {
		return await this.db.insert(invites).values(data).returning();
	}

	async update(id: number, data: Partial<Invite>) {
		return await this.db.update(invites).set(data).where(eq(invites.id, id)).returning();
	}

	async delete(id: number) {
		return await this.db.delete(invites).where(eq(invites.id, id));
	}

	async approve(id: number) {
		return await this.db.update(invites).set({ AdminApproved: true }).where(eq(invites.id, id)).returning();
	}
} 