import { redirect } from "next/navigation";
import React from "react";
import { getCurrentSession } from "@/utils/auth/session";

export default async function UsersPage() {
	const { session } = await getCurrentSession();

	if (!session) {
		return redirect("/login");
	}

	return (
		<div>
			<h1 className="mb-6 font-bold text-3xl">Users Management</h1>
			<div className="rounded-lg bg-white p-6 shadow-md">
				<p>Users management content will go here</p>
			</div>
		</div>
	);
}
