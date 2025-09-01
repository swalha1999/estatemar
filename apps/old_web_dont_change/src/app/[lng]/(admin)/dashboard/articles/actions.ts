"use server";

import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { redirect } from "next/navigation";
import type { Article } from "@/db/schema";
import { getCurrentSession } from "@/utils/auth/session";
import {
	createArticle,
	deleteArticle,
	updateArticle,
} from "@/utils/content/articles";

export async function handleArticleUpdate(
	id: number,
	data: Article,
	lng: string,
) {
	const { session } = await getCurrentSession();

	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	await updateArticle(id, {
		...data,
		updatedAt: new Date(),
	});
	revalidatePath("/", "layout");
	redirect(`/${lng}/dashboard/articles`);
}

export async function handleArticleCreate(data: Article, lng: string) {
	const { session, user } = await getCurrentSession();
	if (!session) {
		return { success: false, error: "Unauthorized" };
	}
	await createArticle({
		...data,
		createdAt: new Date(),
		updatedAt: new Date(),
		// author_id: user.id,
	});
	revalidatePath("/", "layout");
	redirect(`/${lng}/dashboard/articles`);
}

export async function handleArticleDelete(
	id: number,
	lng: string,
	slug: string,
) {
	const { session } = await getCurrentSession();

	if (!session) {
		return { success: false, error: "Unauthorized" };
	}

	try {
		await deleteArticle(id);
		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return { success: false, error: "Failed to delete article" };
	}
}
