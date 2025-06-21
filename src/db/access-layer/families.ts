import { eq, count } from 'drizzle-orm';
import { db } from '..';
import { families, contacts } from '../schema-auth';

export async function getFamilies() {
	const familiesWithCount = await db
		.select({
			id: families.id,
			name: families.name,
			memberCount: count(contacts.id),
		})
		.from(families)
		.leftJoin(contacts, eq(families.id, contacts.familyId))
		.groupBy(families.id, families.name);

	return familiesWithCount;
}

export async function deleteFamily(id: number) {
	await db.delete(families).where(eq(families.id, id));
}

export async function createFamily(name: string) {
	const family = await db.insert(families).values({ name });
	return family;
}

export async function getFamily(id: number) {
	const family = await db.query.families.findFirst({
		where: eq(families.id, id),
	});
	return family;
}