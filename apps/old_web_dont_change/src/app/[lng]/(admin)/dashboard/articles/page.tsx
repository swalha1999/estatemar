import { Button } from "@/components/ui/button";
import { getArticles } from "@/utils/content/articles";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { ArticlesTable } from "./components/articles-table";

interface ArticlesPageProps {
    params: Promise<{ lng: string }>;
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
    const { lng } = await params;
    const articles = await getArticles();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Articles</h1>
                <Button asChild>
                    <Link href={`/${lng}/dashboard/articles/new`}>
                        <Icon name="Plus" className="w-4 h-4 mr-2" />
                        New Article
                    </Link>
                </Button>
            </div>

            <ArticlesTable articles={articles} lng={lng} />
        </div>
    );
}
