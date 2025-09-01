import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
	type File as DBFile,
	type Developer,
	developers,
	files,
	type Project,
	projects,
} from "@/db/schema";

export type DeveloperWithLogo = Developer & {
	logo: DBFile | null;
};

export const getDevelopers = async (): Promise<DeveloperWithLogo[]> => {
	const developersFromDb = await db.query.developers.findMany({
		with: {
			logo: true,
		},
	});
	return developersFromDb as DeveloperWithLogo[];
};

export const getDeveloperById = async (
	id: number,
): Promise<DeveloperWithLogo | null> => {
	const developerWithLogo = await db.query.developers.findFirst({
		where: eq(developers.id, id),
		with: {
			logo: true,
		},
	});
	return developerWithLogo ?? null;
};

export const getDeveloperBySlug = async (
	slug: string,
): Promise<DeveloperWithLogo | null> => {
	const developer = await db.query.developers.findFirst({
		where: eq(developers.slug, slug),
		with: {
			logo: true,
		},
	});
	return developer ?? null;
};

export const createDeveloper = async (
	developer: Omit<Developer, "id" | "slug"> & { logo_id?: number },
) => {
	try {
		const { logo_id, ...rest } = developer;

		const [newDeveloper] = await db
			.insert(developers)
			.values({
				...rest,
				logo: logo_id || null,
			})
			.returning();
	} catch (error) {
		console.error("Error creating developer:", error);
		throw error;
	}
};

export const updateDeveloper = async (
	developer: Developer & { logo_id?: number },
) => {
	const { logo_id, ...rest } = developer;
	await db
		.update(developers)
		.set({ ...rest, logo: logo_id || null })
		.where(eq(developers.id, developer.id))
		.returning();
};

export const deleteDeveloper = async (id: number) => {
	await db.delete(developers).where(eq(developers.id, id));
};

export const getDeveloperProjects = async (
	developerId: number,
): Promise<Project[]> => {
	const projectsforDB = await db.query.projects.findMany({
		where: eq(projects.developer_id, developerId),
	});
	return projectsforDB;
};
