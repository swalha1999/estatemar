import Link from "next/link";
import { getTranslation } from "@/app/i18n";

export default async function NotFound(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;
	const { lng } = params;
	const { t } = await getTranslation(lng, "common");

	return (
		<div className="flex min-h-[70vh] flex-col items-center justify-center p-4">
			<h1 className="mb-4 font-bold text-4xl">404</h1>
			<h2 className="mb-6 text-2xl">{t("pageNotFound")}</h2>
			<p className="mb-8 text-gray-600">{t("pageNotFoundMessage")}</p>
			<Link
				href={`/${lng}`}
				className="rounded-md bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
			>
				{t("backToHome")}
			</Link>
		</div>
	);
}
