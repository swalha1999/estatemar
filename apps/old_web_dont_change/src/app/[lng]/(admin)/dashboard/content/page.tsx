import React from "react";
import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";

export default async function ContentPage() {
    const { session } = await getCurrentSession();

    if (!session) {
        return redirect("/login");
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Content Management</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Content management section will go here</p>
            </div>
        </div>
    );
}
