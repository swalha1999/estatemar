"use server";

import { redirect } from "next/navigation";
import {
	setPasswordResetSessionAsEmailVerified,
	validatePasswordResetSessionRequest,
} from "@/utils/auth/password-reset";
import { ExpiringTokenBucket } from "@/utils/auth/rate-limit";
import { globalPOSTRateLimit } from "@/utils/auth/request";
import { setUserAsEmailVerifiedIfEmailMatches } from "@/utils/auth/user";

const emailVerificationBucket = new ExpiringTokenBucket<number>(5, 60 * 30);

export async function verifyPasswordResetEmailAction(
	_prev: ActionResult,
	formData: FormData,
): Promise<ActionResult> {
	if (!globalPOSTRateLimit()) {
		return {
			message: "Too many requests",
		};
	}
	const { session } = await validatePasswordResetSessionRequest();
	if (session === null) {
		return {
			message: "Not authenticated",
		};
	}
	if (session.emailVerified) {
		return {
			message: "Forbidden",
		};
	}
	if (!emailVerificationBucket.check(session.userId, 1)) {
		return {
			message: "Too many requests",
		};
	}

	const code = formData.get("code");
	if (typeof code !== "string") {
		return {
			message: "Invalid or missing fields",
		};
	}
	if (code === "") {
		return {
			message: "Please enter your code",
		};
	}
	if (!emailVerificationBucket.consume(session.userId, 1)) {
		return { message: "Too many requests" };
	}
	if (code !== session.code) {
		return {
			message: "Incorrect code",
		};
	}
	emailVerificationBucket.reset(session.userId);
	await setPasswordResetSessionAsEmailVerified(session.id);
	const emailMatches = await setUserAsEmailVerifiedIfEmailMatches(
		session.userId,
		session.email,
	);
	if (!emailMatches) {
		return {
			message: "Please restart the process",
		};
	}
	return redirect("/reset-password/2fa");
}

interface ActionResult {
	message: string;
}
