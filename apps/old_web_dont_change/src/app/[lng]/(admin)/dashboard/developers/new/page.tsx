import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { DeveloperForm } from "../components/developer-form";
import { getTranslation } from "@/app/i18n";

export default async function NewDeveloperPage(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;
    const { lng } = params;

    const { t } = await getTranslation(lng, "dashboard");
    const { session } = await getCurrentSession();

    if (!session) {
        return redirect("/login");
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t("add_developer")}</h1>
            </div>
            <DeveloperForm lng={lng} />
        </div>
    );
}
