import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { DeveloperForm } from "../../components/developer-form";
import { getTranslation } from "@/app/i18n";
import { getDeveloperById } from "@/utils/listings/developer";
export default async function EditDeveloperPage(props: {
    params: Promise<{ lng: string; id: string }>;
}) {
    const params = await props.params;
    const { lng, id } = params;

    const { t } = await getTranslation(lng, "dashboard");
    const { session } = await getCurrentSession();

    if (!session) {
        return redirect("/login");
    }

    const developer = await getDeveloperById(parseInt(id));

    if (!developer) {
        return redirect(`/${lng}/dashboard/developers`);
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{t("edit_developer")}</h1>
            </div>
            <DeveloperForm lng={lng} developer={developer} />
        </div>
    );
}
