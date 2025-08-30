import { getTranslation } from "@/app/i18n";
import { getPublishedArticles } from "@/utils/content/articles";
import Image from "next/image";
import Link from "next/link";
import styles from "./articles.module.css";

export default async function ArticlesPage(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;

    const { lng } = params;

    const { t } = await getTranslation(lng, "articles-page", {});

    const articles = await getPublishedArticles(lng);

    return (
        <div className={styles.articlesPage}>
            <h1 className={styles.pageTitle}>{t("articlesTitle")}</h1>

            <div className={styles.searchBar}>
                <input type="text" placeholder={t("searchPlaceholder")} />
            </div>

            <div className={styles.articlesList}>
                {articles.map((article) => (
                    <article key={article.article.id} className={styles.articlePreview}>
                        {article.image?.url && (
                            <Image
                                src={article.image?.url}
                                alt={article.article.title}
                                className={styles.articleImage}
                                width={400}
                                height={200}
                            />
                        )}
                        <div className={styles.articleContent}>
                            <h2 className={styles.articleTitle}>{article.article.title}</h2>
                            <p className={styles.articleExcerpt}>{article.article.excerpt}</p>
                            <div className={styles.articleFooter}>
                                <Link
                                    href={`/${lng}/articles/${article.article.slug}`}
                                    className={styles.readMore}
                                    prefetch={true}
                                >
                                    {t("readMore")}
                                </Link>
                                <p className={styles.articleMeta}>
                                    {t("by")} {article.article.author} |{" "}
                                    {article.article.createdAt.toLocaleDateString()} |{" "}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
