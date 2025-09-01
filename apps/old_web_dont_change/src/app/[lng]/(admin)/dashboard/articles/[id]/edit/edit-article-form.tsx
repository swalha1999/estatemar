"use client";

import type { ArticleWithImage } from "@/utils/content/articles";
import { handleArticleUpdate } from "../../actions";
import { ArticleForm } from "../../components/article-form";

interface EditArticleFormProps {
	article: ArticleWithImage;
	lng: string;
}

export function EditArticleForm({ article, lng }: EditArticleFormProps) {
	async function onSubmit(data: any) {
		await handleArticleUpdate(article.article.id, data, lng);
	}

	return <ArticleForm article={article} onSubmit={onSubmit} lng={lng} />;
}
