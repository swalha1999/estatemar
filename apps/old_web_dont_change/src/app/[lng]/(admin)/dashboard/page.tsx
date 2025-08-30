import React from "react";

import { getTranslation } from "@/app/i18n";
import { getClientIP } from "@/utils/UserIP";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/utils/auth/session";

export default async function Dashboard(props: { params: Promise<{ lng: string }> }) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("welcome_message")}</h2>
                    <p>
                        {t("client_ip")}: {clientIP || t("unknown")}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("quick_stats")}</h2>
                    <ul>
                        <li>{t("total_users")}: 1,234</li>
                        <li>{t("active_listings")}: 567</li>
                        <li>{t("pending_approvals")}: 89</li>
                    </ul>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">{t("recent_activity")}</h2>
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
