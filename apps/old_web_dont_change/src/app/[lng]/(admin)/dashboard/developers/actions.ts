"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/utils/auth/session";
import {
	createDeveloper,
	deleteDeveloper,
	getDevelopers,
	updateDeveloper,
} from "@/utils/listings/developer";

export async function fetchDevelopers() {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		const developers = await getDevelopers();
		return { success: true, data: developers };
	} catch (error) {
		console.error("Error fetching developers:", error);
		return { success: false, error: "Failed to fetch developers" };
	}
}

export async function addDeveloper(data: any) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		const developer = await createDeveloper(data);
		revalidatePath("/[lng]/dashboard/developers", "page");
		return { success: true, data: developer };
	} catch (error) {
		return { success: false, error: "Failed to create developer" };
	}
}

export async function editDeveloper(data: any) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		const developer = await updateDeveloper(data);
		revalidatePath("/[lng]/dashboard/developers", "page");
		return { success: true, data: developer };
	} catch (error) {
		return { success: false, error: "Failed to update developer" };
	}
}

export async function removeDeveloper(id: number) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		await deleteDeveloper(id);
		revalidatePath("/[lng]/dashboard/developers", "page");
		return { success: true };
	} catch (error) {
		return { success: false, error: "Failed to delete developer" };
	}
}
