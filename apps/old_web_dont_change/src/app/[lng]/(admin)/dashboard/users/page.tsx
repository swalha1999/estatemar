import React from "react";
import { getCurrentSession } from "@/utils/auth/session";
import { redirect } from "next/navigation";

export default async function UsersPage() {
    const { session } = await getCurrentSession();

    if (!session) {
        return redirect("/login");
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Users Management</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <p>Users management content will go here</p>
            </div>
        </div>
    );
}
