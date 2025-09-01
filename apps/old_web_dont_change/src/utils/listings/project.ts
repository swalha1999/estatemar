import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
	type File as FileType,
	type Project,
	project_amenities,
	project_files,
	project_images,
	projects,
} from "@/db/schema";

export interface CreateProjectData extends Omit<Project, "id"> {
	amenity_ids: number[] | undefined;
	images: FileType[] | undefined;
	files: FileType[] | undefined;
}

export type ProjectDetails = NonNullable<
	Awaited<ReturnType<typeof getProject>>
>;
export const getProject = async (id?: number, slug?: string) => {
	if (!id && !slug) return null;
	const where = id ? eq(projects.id, id) : eq(projects.slug, slug!);

	const project = await db.query.projects.findFirst({
		where,
		with: {
			developer: {
				with: {
					logo: true,
				},
			},
			images: {
				with: {
					image: true,
				},
				orderBy: (project_images, { asc }) => [asc(project_images.order_index)],
			},
			files: {
				with: {
					file: true,
				},
			},
			amenities: {
				with: {
					amenity: true,
				},
			},
			units: true,
		},
	});

	return project;
};

export const getProjects = async (): Promise<ProjectDetails[]> => {
	const projectsWithDetails = await db.query.projects.findMany({
		with: {
			developer: {
				with: {
					logo: true,
				},
			},
			images: {
				with: {
					image: true,
				},
				orderBy: (project_images, { asc }) => [asc(project_images.order_index)],
			},
			files: {
				with: {
					file: true,
				},
			},
			amenities: {
				with: {
					amenity: true,
				},
			},
			units: true,
		},
	});

	return projectsWithDetails;
};

export const createProjectWithDetails = async (data: CreateProjectData) => {
	// split the data into two parts, one for the project and one for the files
	const { images, files, amenity_ids, ...projectData } = data;

	const newProject = await db
		.insert(projects)
		.values({
			...projectData,
			created_at: new Date(),
		})
		.returning();

	const newProjectId = newProject[0].id;

	if (Array.isArray(images)) {
		for (const image of images) {
			await db.insert(project_images).values({
				project_id: newProjectId,
				image_id: image.id,
			});
		}
	}

	if (Array.isArray(files)) {
		for (const file of files) {
			await db.insert(project_files).values({
				project_id: newProjectId,
				file_id: file.id,
				title: file.caption || "Untitled",
			});
		}
	}

	if (Array.isArray(amenity_ids)) {
		for (const amenityId of amenity_ids) {
			await db.insert(project_amenities).values({
				project_id: newProjectId,
				amenity_id: amenityId,
			});
		}
	}

	return newProject;
};

export const updateProject = async (id: number, project: CreateProjectData) => {
	const { images, files, amenity_ids, ...projectData } = project;

	const updatedProject = await db
		.update(projects)
		.set(projectData)
		.where(eq(projects.id, id))
		.returning();

	const newProjectId = updatedProject[0].id;

	//delete all the images, files and amenities
	await db
		.delete(project_images)
		.where(eq(project_images.project_id, newProjectId));
	await db
		.delete(project_files)
		.where(eq(project_files.project_id, newProjectId));
	await db
		.delete(project_amenities)
		.where(eq(project_amenities.project_id, newProjectId));

	if (Array.isArray(images)) {
		for (const image of images) {
			await db.insert(project_images).values({
				project_id: newProjectId,
				image_id: image.id,
			});
		}
	}

	if (Array.isArray(files)) {
		for (const file of files) {
			await db.insert(project_files).values({
				project_id: newProjectId,
				file_id: file.id,
				title: file.caption || "Untitled",
			});
		}
	}

	if (Array.isArray(amenity_ids)) {
		for (const amenityId of amenity_ids) {
			await db.insert(project_amenities).values({
				project_id: newProjectId,
				amenity_id: amenityId,
			});
		}
	}

	return updatedProject;
};

export const deleteProject = async (id: number) => {
	const deletedProject = await db
		.delete(projects)
		.where(eq(projects.id, id))
		.returning();
	return deletedProject;
};
