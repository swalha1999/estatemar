"use server";

import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import {
	deleteSessionTokenCookie,
	getCurrentSession,
	invalidateSession,
} from "@/utils/auth/session";

export async function logoutAction() {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests",
		};
	}
	const { session } = await getCurrentSession();
	if (session === null) {
		return {
			message: "Not authenticated",
		};
	}
	invalidateSession(session.id);
	deleteSessionTokenCookie();
	return redirect("/login");
}
