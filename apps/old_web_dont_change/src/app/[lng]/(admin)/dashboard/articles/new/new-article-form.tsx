"use client";

import { ArticleForm } from "../components/article-form";
import { handleArticleCreate } from "../actions";

interface NewArticleFormProps {
    lng: string;
}

export function NewArticleForm({ lng }: NewArticleFormProps) {
    async function onSubmit(data: any) {
        await handleArticleCreate(data, lng);
    }

    return <ArticleForm onSubmit={onSubmit} lng={lng} />;
}
