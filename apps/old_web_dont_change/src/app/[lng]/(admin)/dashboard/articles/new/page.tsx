import { NewArticleForm } from "./new-article-form";
import { getTranslation } from "@/app/i18n";

interface NewArticlePageProps {
    params: Promise<{ lng: string }>;
}

export default async function NewArticlePage({ params }: NewArticlePageProps) {
    const { lng } = await params;
    const { t } = await getTranslation(lng, "dashboard");

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t("create_article")}</h1>
            </div>
            <NewArticleForm lng={lng} />
        </div>
    );
}
