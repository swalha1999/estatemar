"use server";

import { revalidatePath } from "next/cache";
import { getCurrentSession } from "@/utils/auth/session";
import {
	createAmenityDB,
	deleteAmenityDB,
	getAmenityDB,
	updateAmenityDB,
} from "@/utils/content/amenities";

export interface CreateAmenityInput {
	name: string;
	description?: string;
	icon: string;
}

export interface UpdateAmenityInput {
	id: string;
	name: string;
	description: string;
	icon: string;
}

export async function createAmenity(data: CreateAmenityInput) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return {
				error: "Unauthorized",
				success: false,
			};
		}

		const { name, description, icon } = data;

		if (!name || !icon) {
			return {
				error: "Name and icon are required",
				success: false,
			};
		}

		const amenity = await createAmenityDB({ name, description, icon });

		revalidatePath("/[lng]/dashboard/amenities", "page");
		// TODO: add tag to revalidate the listing page

		return {
			data: amenity,
			success: true,
		};
	} catch (error) {
		console.error("Error creating amenity:", error);
		return {
			error: "Failed to create amenity",
			success: false,
		};
	}
}

export async function getAmenity(id: string) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			throw new Error("Unauthorized");
		}

		return await getAmenityDB(Number(id));
	} catch (error) {
		console.error("Error fetching amenity:", error);
		throw error;
	}
}

export async function updateAmenity(data: UpdateAmenityInput) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return {
				success: false,
				error: "Unauthorized",
			};
		}

		const { id, name, description, icon } = data;

		if (!name || !icon) {
			return {
				success: false,
				error: "Name and icon are required",
			};
		}

		const updated = await updateAmenityDB(Number(id), {
			name,
			description,
			icon,
		});

		revalidatePath("/[lng]/dashboard/amenities", "page");
		// TODO: add tag to revalidate the listing page

		return {
			success: true,
			data: updated,
		};
	} catch (error) {
		console.error("Error updating amenity:", error);
		return {
			success: false,
			error: "Failed to update amenity",
		};
	}
}

export async function deleteAmenity(id: string) {
	try {
		const { session } = await getCurrentSession();

		if (!session) {
			return { success: false, error: "Unauthorized" };
		}

		await deleteAmenityDB(Number(id));

		revalidatePath("/[lng]/dashboard/amenities", "page");
		// TODO: add tag to revalidate the listing page
		return { success: true };
	} catch (error) {
		console.error("Error deleting amenity:", error);
		throw error;
	}
}
