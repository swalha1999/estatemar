"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ArticleWithImage } from "@/utils/content/articles";
import { handleArticleDelete } from "../actions";

interface ArticlesTableProps {
	articles: ArticleWithImage[];
	lng: string;
}

export function ArticlesTable({ articles, lng }: ArticlesTableProps) {
	const router = useRouter();

	async function onDelete(id: number, slug: string) {
		try {
			const result = await handleArticleDelete(id, lng, slug);
			if (result.success) {
				router.refresh();
			} else {
				console.error("Failed to delete article:", result.error);
			}
		} catch (error) {
			console.error("Failed to delete article:", error);
		}
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Title</TableHead>
					<TableHead>Author</TableHead>
					<TableHead>Language</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{articles.map((article) => (
					<TableRow key={article.article.id}>
						<TableCell>{article.article.title}</TableCell>
						<TableCell>{article.article.author}</TableCell>
						<TableCell>{article.article.language}</TableCell>
						<TableCell>
							{article.article.is_published ? (
								<span className="text-green-600">Published</span>
							) : (
								<span className="text-yellow-600">Draft</span>
							)}
						</TableCell>
						<TableCell className="space-x-2 text-right">
							<Button variant="ghost" size="icon" asChild>
								<Link
									href={`/${lng}/dashboard/articles/${article.article.id}/edit`}
								>
									<Icon name="Pencil" className="h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="text-red-600 hover:text-red-700"
								onClick={() =>
									onDelete(article.article.id, article.article.slug)
								}
							>
								<Icon name="Trash" className="h-4 w-4" />
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
