import React from "react";
import { getTranslation } from "@/app/i18n";
import "./article.css";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getArticleBySlug, getArticles } from "@/utils/content/articles";
export async function generateMetadata(props: {
	params: Promise<{ slug: string; lng: string }>;
}): Promise<Metadata> {
	const params = await props.params;

	const { slug, lng } = params;

	const article = await getArticleBySlug(slug, lng);

	if (!article) {
		return {
			title: "Article Not Found | Estatemar",
			description: "The requested article could not be found.",
		};
	}

	return {
		title: `${article.article.title} | Estatemar`,
		description: article.article.excerpt,
	};
}

export default async function ArticlePage(props: {
	params: Promise<{ lng: string; slug: string }>;
}) {
	const params = await props.params;

	const { lng, slug } = params;

	const { t } = await getTranslation(lng, "article-page", {});
	const article = await getArticleBySlug(slug, lng);

	if (!article) {
		return redirect(`/${lng}/not-found`);
	}

	return (
		<div className="article-page">
			<h1 className="main-title">{article.article.title}</h1>
			{article.image?.url && (
				<Image
					src={article.image.url}
					alt={article.article.title}
					className="article-image"
					width={400}
					height={200}
				/>
			)}
			<p className="article-excerpt">{article.article.excerpt}</p>
			<p className="article-meta">
				{t("by")} {article.article.author} {t("on")}{" "}
				{article.article.createdAt.toLocaleDateString()}
			</p>
			<div className="article-content">
				<ReactMarkdown>{article.article.content}</ReactMarkdown>
			</div>
		</div>
	);
}

// todo: add language support for static params
export async function generateStaticParams() {
	const articles = await getArticles();
	return articles.map((article) => ({
		slug: article.article.slug,
		lng: article.article.language,
	}));
}
