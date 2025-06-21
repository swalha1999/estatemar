import { db } from '@/db';
import { leads } from '@/db/schema-auth';
import { desc, eq } from 'drizzle-orm';

export async function getAllLeads() {
	return await db.query.leads.findMany({
		orderBy: [desc(leads.createdAt)],
	});
}

export async function deleteLead(id: number) {
	return await db.delete(leads).where(eq(leads.id, id));
}