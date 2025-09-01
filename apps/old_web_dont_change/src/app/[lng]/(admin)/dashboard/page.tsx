import { redirect } from "next/navigation";
import React from "react";
import { getTranslation } from "@/app/i18n";
import { getCurrentSession } from "@/utils/auth/session";
import { getClientIP } from "@/utils/UserIP";

export default async function Dashboard(props: {
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;

	const { lng } = params;

	const { t } = await getTranslation(lng, "dashboard", {});
	const clientIP = await getClientIP();
	const { session, user } = await getCurrentSession();

	if (!session) {
		return redirect("/login");
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-lg bg-white p-6 shadow-md">
					<h2 className="mb-4 font-semibold text-xl">{t("welcome_message")}</h2>
					<p>
						{t("client_ip")}: {clientIP || t("unknown")}
					</p>
				</div>

				<div className="rounded-lg bg-white p-6 shadow-md">
					<h2 className="mb-4 font-semibold text-xl">{t("quick_stats")}</h2>
					<ul>
						<li>{t("total_users")}: 1,234</li>
						<li>{t("active_listings")}: 567</li>
						<li>{t("pending_approvals")}: 89</li>
					</ul>
				</div>

				<div className="rounded-lg bg-white p-6 shadow-md">
					<h2 className="mb-4 font-semibold text-xl">{t("recent_activity")}</h2>
					<ul>
						<li>{t("new_user_registered")}</li>
						<li>{t("listing_updated")}</li>
						<li>{t("approval_request")}</li>
					</ul>
				</div>
			</div>
		</>
	);
}
