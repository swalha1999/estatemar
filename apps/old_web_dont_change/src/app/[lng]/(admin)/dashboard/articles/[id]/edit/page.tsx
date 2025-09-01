import { getArticle } from "@/utils/content/articles";
import { EditArticleForm } from "./edit-article-form";

interface EditArticlePageProps {
	params: Promise<{ lng: string; id: string }>;
}

export default async function EditArticlePage({
	params,
}: EditArticlePageProps) {
	const { lng, id } = await params;
	const article = await getArticle(Number.parseInt(id));

	return (
		<div className="p-6">
			<h1 className="mb-6 font-bold text-2xl">Edit Article</h1>
			<EditArticleForm article={article} lng={lng} />
		</div>
	);
}
