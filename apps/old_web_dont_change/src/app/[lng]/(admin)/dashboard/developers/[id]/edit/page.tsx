import { redirect } from "next/navigation";
import { getTranslation } from "@/app/i18n";
import { getCurrentSession } from "@/utils/auth/session";
import { getDeveloperById } from "@/utils/listings/developer";
import { DeveloperForm } from "../../components/developer-form";
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

	const developer = await getDeveloperById(Number.parseInt(id));

	if (!developer) {
		return redirect(`/${lng}/dashboard/developers`);
	}

	return (
		<div className="p-6">
			<div className="mb-6">
				<h1 className="font-bold text-2xl">{t("edit_developer")}</h1>
			</div>
			<DeveloperForm lng={lng} developer={developer} />
		</div>
	);
}
