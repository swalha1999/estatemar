import Link from "next/link";
import { getTranslation } from "@/app/i18n";
import "./article.css";
import { Icon } from "@/components/icon";

export default async function ArticleLayout(props: {
	children: React.ReactNode;
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;
	const { lng } = params;
	const { children } = props;

	const { t } = await getTranslation(lng, "common");
	const isRTL = ["ar", "he"].includes(lng);

	return (
		<div className={`article-layout ${lng}`}>
			<nav className="article-nav">
				<Link href={`/${lng}/articles`} className="back-link" prefetch={true}>
					{isRTL ? (
						<>
							<Icon name="IoIosArrowBack" className={"back-icon rtl-icon"} />
							{t("backToArticles")}
						</>
					) : (
						<>
							<Icon name="IoIosArrowBack" className="back-icon" />
							{t("backToArticles")}
						</>
					)}
				</Link>
			</nav>
			<main>{children}</main>
		</div>
	);
}
