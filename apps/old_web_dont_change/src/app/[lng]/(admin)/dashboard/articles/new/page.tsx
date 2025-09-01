import { getTranslation } from "@/app/i18n";
import { NewArticleForm } from "./new-article-form";

interface NewArticlePageProps {
	params: Promise<{ lng: string }>;
}

export default async function NewArticlePage({ params }: NewArticlePageProps) {
	const { lng } = await params;
	const { t } = await getTranslation(lng, "dashboard");

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">{t("create_article")}</h1>
			</div>
			<NewArticleForm lng={lng} />
		</div>
	);
}
