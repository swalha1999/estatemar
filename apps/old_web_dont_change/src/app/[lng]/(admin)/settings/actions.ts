"use server";

import { redirect } from "next/navigation";
import { sendTestEmail } from "@/lib/email/sendEmail";
import { checkEmailAvailability, verifyEmailInput } from "@/utils/auth/email";
import {
	createEmailVerificationRequest,
	sendVerificationEmail,
	sendVerificationEmailBucket,
	setEmailVerificationRequestCookie,
} from "@/utils/auth/email-verification";
import {
	verifyPasswordHash,
	verifyPasswordStrength,
} from "@/utils/auth/password";
import { ExpiringTokenBucket } from "@/utils/auth/rate-limit";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import type { SessionFlags } from "@/utils/auth/session";
import {
	createSession,
	generateSessionToken,
	getCurrentSession,
	invalidateUserSessions,
	setSessionTokenCookie,
} from "@/utils/auth/session";
import {
	getUserPasswordHash,
	resetUserRecoveryCode,
	updateUserPassword,
} from "@/utils/auth/user";

const passwordUpdateBucket = new ExpiringTokenBucket<string>(5, 60 * 30);

export async function updatePasswordAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests",
		};
	}
	const { session, user } = await getCurrentSession();
	if (session === null) {
		return {
			message: "Not authenticated",
		};
	}
	if (user.registered_2fa && !session.two_factor_verified) {
		return {
			message: "Forbidden",
		};
	}
	if (!passwordUpdateBucket.check(session.id, 1)) {
		return {
			message: "Too many requests",
		};
	}

	const password = formData.get("password");
	const newPassword = formData.get("new_password");
	if (typeof password !== "string" || typeof newPassword !== "string") {
		return {
			message: "Invalid or missing fields",
		};
	}
	const strongPassword = await verifyPasswordStrength(newPassword);
	if (!strongPassword) {
		return {
			message: "Weak password",
		};
	}
	if (!passwordUpdateBucket.consume(session.id, 1)) {
		return {
			message: "Too many requests",
		};
	}
	const passwordHash = await getUserPasswordHash(user.id);
	const validPassword = await verifyPasswordHash(passwordHash, password);
	if (!validPassword) {
		return {
			message: "Incorrect password",
		};
	}
	passwordUpdateBucket.reset(session.id);
	await invalidateUserSessions(user.id);
	await updateUserPassword(user.id, newPassword);

	const sessionToken = generateSessionToken();
	const sessionFlags: SessionFlags = {
		twoFactorVerified: session.two_factor_verified,
	};
	const newSession = await createSession(sessionToken, user.id, sessionFlags);
	setSessionTokenCookie(sessionToken, newSession.expiresAt);
	return {
		message: "Updated password",
	};
}

export async function updateEmailAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests",
		};
	}
	const { session, user } = await getCurrentSession();
	if (session === null) {
		return {
			message: "Not authenticated",
		};
	}
	if (user.registered_2fa && !session.two_factor_verified) {
		return {
			message: "Forbidden",
		};
	}
	if (!sendVerificationEmailBucket.check(user.id, 1)) {
		return {
			message: "Too many requests",
		};
	}

	const email = formData.get("email");
	if (typeof email !== "string") {
		return { message: "Invalid or missing fields" };
	}
	if (email === "") {
		return {
			message: "Please enter your email",
		};
	}
	if (!verifyEmailInput(email)) {
		return {
			message: "Please enter a valid email",
		};
	}
	const emailAvailable = checkEmailAvailability(email);
	if (!emailAvailable) {
		return {
			message: "This email is already used",
		};
	}
	if (!sendVerificationEmailBucket.consume(user.id, 1)) {
		return {
			message: "Too many requests",
		};
	}
	const verificationRequest = await createEmailVerificationRequest(
		user.id,
		email,
	);
	await sendVerificationEmail(
		verificationRequest.email,
		user.username,
		verificationRequest.code,
	);
	setEmailVerificationRequestCookie(verificationRequest);
	return redirect("/verify-email");
}

export async function regenerateRecoveryCodeAction(): Promise<RegenerateRecoveryCodeActionResult> {
	if (!globalPOSTRateLimit()) {
		return {
			error: "Too many requests",
			recoveryCode: null,
		};
	}
	const { session, user } = await getCurrentSession();
	if (session === null || user === null) {
		return {
			error: "Not authenticated",
			recoveryCode: null,
		};
	}
	if (!user.email_verified) {
		return {
			error: "Forbidden",
			recoveryCode: null,
		};
	}
	if (!session.two_factor_verified) {
		return {
			error: "Forbidden",
			recoveryCode: null,
		};
	}
	const recoveryCode = await resetUserRecoveryCode(session.userId);
	return {
		error: null,
		recoveryCode,
	};
}

export async function sendTestEmailAction(): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (session === null || user === null) {
		return {
			message: "Not authenticated",
		};
	}
	const { error } = await sendTestEmail(
		user.email,
		user.username,
		"This is a test email",
	);
	if (error) {
		return {
			message: "Failed to send test email",
		};
	}

	return {
		message: "Test email sent",
	};
}

interface ActionResult {
	message: string;
}

type RegenerateRecoveryCodeActionResult =
	| {
			error: string;
			recoveryCode: null;
	  }
	| {
			error: null;
			recoveryCode: string;
	  };
