import React from "react";
import { fetchDevelopers } from "./actions";
import { DevelopersTable } from "./components/developers-table";
import { getTranslation } from "@/app/i18n";
import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@/components/icon";

export default async function DevelopersPage(props: { params: Promise<{ lng: string }> }) {
    const params = await props.params;
    const { lng } = params;

    const { t } = await getTranslation(lng, "dashboard");
    const { session } = await getCurrentSession();

    if (!session) {
        return redirect("/login");
    }

    const result = await fetchDevelopers();
    if (!result.success) {
        return <div>Error loading developers</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{t("developers_management")}</h1>
                <Link href={`/${lng}/dashboard/developers/new`}>
                    <Button>
                        <Icon name="Plus" className="mr-2 h-4 w-4" />
                        Add Developer
                    </Button>
                </Link>
            </div>
            <DevelopersTable developers={result.data || []} lng={lng} />
        </div>
    );
}
