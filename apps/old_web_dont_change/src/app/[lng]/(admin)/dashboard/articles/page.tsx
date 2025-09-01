import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { getArticles } from "@/utils/content/articles";
import { ArticlesTable } from "./components/articles-table";

interface ArticlesPageProps {
	params: Promise<{ lng: string }>;
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
	const { lng } = await params;
	const articles = await getArticles();

	return (
		<div className="p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-2xl">Articles</h1>
				<Button asChild>
					<Link href={`/${lng}/dashboard/articles/new`}>
						<Icon name="Plus" className="mr-2 h-4 w-4" />
						New Article
					</Link>
				</Button>
			</div>

			<ArticlesTable articles={articles} lng={lng} />
		</div>
	);
}
