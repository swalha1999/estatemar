import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
	type Article,
	articles,
	type File as DBFile,
	files,
} from "@/db/schema";

export interface ArticleWithImage {
	article: Article;
	image: DBFile | null;
}

export async function createArticle(article: Article): Promise<Article> {
	const newArticle = await db.insert(articles).values(article).returning();

	if (!newArticle || newArticle.length === 0) {
		throw new Error("Failed to create article");
	}

	return newArticle[0];
}

export async function getArticle(id: number): Promise<ArticleWithImage> {
	const article = await db
		.select({
			article: articles,
			image: files,
		})
		.from(articles)
		.innerJoin(files, eq(articles.image_id, files.id))
		.where(eq(articles.id, id));

	if (!article || article.length === 0) {
		throw new Error("Article not found");
	}

	return article[0];
}

export async function getArticleBySlug(
	slug: string,
	lng: string,
): Promise<ArticleWithImage> {
	const article = await db
		.select({
			article: articles,
			image: files,
		})
		.from(articles)
		.innerJoin(files, eq(articles.image_id, files.id))
		.where(and(eq(articles.slug, slug), eq(articles.language, lng)));

	return article[0];
}

export async function getArticles(): Promise<ArticleWithImage[]> {
	const articlesFromDb = await db
		.select({
			article: articles,
			image: files,
		})
		.from(articles)
		.innerJoin(files, eq(articles.image_id, files.id));

	return articlesFromDb;
}

export async function getPublishedArticles(
	lng: string,
): Promise<ArticleWithImage[]> {
	const articlesFromDb = await db
		.select({
			article: articles,
			image: files,
		})
		.from(articles)
		.innerJoin(files, eq(articles.image_id, files.id))
		.where(and(eq(articles.is_published, true), eq(articles.language, lng)));

	return articlesFromDb;
}

export async function deleteArticle(id: number): Promise<void> {
	await db.delete(articles).where(eq(articles.id, id));
}

export async function updateArticle(
	id: number,
	article: Partial<Article>,
): Promise<Article> {
	const updatedArticle = await db
		.update(articles)
		.set(article)
		.where(eq(articles.id, id))
		.returning();

	if (!updatedArticle || updatedArticle.length === 0) {
		throw new Error("Failed to update article");
	}

	return updatedArticle[0];
}
