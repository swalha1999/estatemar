"use server";

import { getCurrentSession } from "@/utils/auth/session";
import {
    createProjectWithDetails,
    getProjects,
    type CreateProjectData,
    deleteProject,
    getProject,
    updateProject,
} from "@/utils/listings/project";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { getDevelopers } from "@/utils/listings/developer";
import { getAmenities } from "@/utils/content/amenities";
import { Developer } from "@/db/schema";

export async function fetchDevelopersAction(): Promise<{
    success: boolean;
    data: Developer[] | null;
    error?: string;
}> {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized", data: [] };
    }

    const developers = await getDevelopers();
    return { success: true, data: developers };
}

export async function fetchAmenitiesAction() {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized", data: [] };
    }

    const amenities = await getAmenities();
    return { success: true, data: amenities };
}

export async function fetchProjectsAction(lng: string) {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized", data: [] };
    }

    const projects = await getProjects();
    return { success: true, data: projects };
}

export async function createProjectAction(data: CreateProjectData) {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const formattedData = {
            ...data,
            date_of_completion: data.date_of_completion ? new Date(data.date_of_completion) : null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        const project = await createProjectWithDetails(formattedData);
        revalidatePath("/[lng]/dashboard/projects", "page");
        revalidatePath(`/`, "layout");
        return { success: true, data: project };
    } catch (error) {
        console.error("Error creating project:", error);
        return { success: false, error: "Failed to create project" };
    }
}

export async function deleteProjectAction(id: number) {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    await deleteProject(id);
    revalidatePath("/[lng]/dashboard/projects", "page");
    revalidatePath(`/`, "layout");
}

export async function fetchProjectByIdAction(id: number) {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized", data: null };
    }

    try {
        const project = await getProject(id);
        return { success: true, data: project };
    } catch (error) {
        console.error("Error fetching project:", error);
        return { success: false, error: "Failed to fetch project", data: null };
    }
}

export async function updateProjectAction(id: number, data: CreateProjectData) {
    const { session } = await getCurrentSession();

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const formattedData = {
            ...data,
            date_of_completion: data.date_of_completion ? new Date(data.date_of_completion) : null,
            updated_at: new Date(),
        };

        const project = await updateProject(id, formattedData);
        revalidatePath("/[lng]/dashboard/projects", "page");
        revalidatePath(`/`, "layout");
        return { success: true, data: project };
    } catch (error) {
        console.error("Error updating project:", error);
        return { success: false, error: "Failed to update project" };
    }
}
