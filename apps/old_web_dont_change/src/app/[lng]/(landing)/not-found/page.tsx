import { getTranslation } from "@/app/i18n";
import Link from "next/link";

export default async function NotFound(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;
    const { lng } = params;
    const { t } = await getTranslation(lng, "common");

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <h2 className="text-2xl mb-6">{t("pageNotFound")}</h2>
            <p className="text-gray-600 mb-8">{t("pageNotFoundMessage")}</p>
            <Link
                href={`/${lng}`}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
                {t("backToHome")}
            </Link>
        </div>
    );
}
