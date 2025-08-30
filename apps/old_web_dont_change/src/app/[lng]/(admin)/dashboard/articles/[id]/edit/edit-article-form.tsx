"use client";

import { ArticleForm } from "../../components/article-form";
import { handleArticleUpdate } from "../../actions";
import { type ArticleWithImage } from "@/utils/content/articles";

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
