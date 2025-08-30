import { EditArticleForm } from "./edit-article-form";
import { getArticle } from "@/utils/content/articles";

interface EditArticlePageProps {
    params: Promise<{ lng: string; id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
    const { lng, id } = await params;
    const article = await getArticle(parseInt(id));

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Article</h1>
            <EditArticleForm article={article} lng={lng} />
        </div>
    );
}
