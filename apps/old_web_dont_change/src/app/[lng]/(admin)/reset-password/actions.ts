"use server";

import { redirect } from "next/navigation";
import { verifyPasswordStrength } from "@/utils/auth/password";
import {
	deletePasswordResetSessionTokenCookie,
	invalidateUserPasswordResetSessions,
	validatePasswordResetSessionRequest,
} from "@/utils/auth/password-reset";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import type { SessionFlags } from "@/utils/auth/session";
import {
	createSession,
	generateSessionToken,
	invalidateUserSessions,
	setSessionTokenCookie,
} from "@/utils/auth/session";
import { updateUserPassword } from "@/utils/auth/user";

export async function resetPasswordAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests",
		};
	}
	const { session: passwordResetSession, user } =
		await validatePasswordResetSessionRequest();
	if (passwordResetSession === null) {
		return {
			message: "Not authenticated",
		};
	}
	if (!passwordResetSession.emailVerified) {
		return {
			message: "Forbidden",
		};
	}
	if (user.registered_2fa && !passwordResetSession.twoFactorVerified) {
		return {
			message: "Forbidden",
		};
	}

	const password = formData.get("password");
	if (typeof password !== "string") {
		return {
			message: "Invalid or missing fields",
		};
	}

	const strongPassword = await verifyPasswordStrength(password);
	if (!strongPassword) {
		return {
			message: "Weak password",
		};
	}
	invalidateUserPasswordResetSessions(passwordResetSession.userId);
	invalidateUserSessions(passwordResetSession.userId);
	await updateUserPassword(passwordResetSession.userId, password);

	const sessionFlags: SessionFlags = {
		twoFactorVerified: passwordResetSession.twoFactorVerified,
	};
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id, sessionFlags);
	setSessionTokenCookie(sessionToken, session.expiresAt);
	deletePasswordResetSessionTokenCookie();
	return redirect("/");
}

interface ActionResult {
	message: string;
}
