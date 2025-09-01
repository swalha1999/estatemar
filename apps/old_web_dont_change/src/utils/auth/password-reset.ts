import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { eq, sql } from "drizzle-orm";
import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

import { db } from "@/db";
import type { PasswordResetSession, User } from "@/db/schema";
import { password_reset_sessions, users } from "@/db/schema";
import { removeSensitiveUserFields } from "@/utils/auth/user";
import { generateRandomOTP } from "@/utils/auth/utils";

export async function createPasswordResetSession(
	token: string,
	userId: number,
	email: string,
): Promise<PasswordResetSession> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: PasswordResetSession = {
		id: sessionId,
		userId,
		email,
		expiresAt: new Date(Date.now() + 1000 * 60 * 10),
		code: generateRandomOTP(),
		emailVerified: false,
		twoFactorVerified: false,
	};

	await db.insert(password_reset_sessions).values(session);
	return session;
}

// i think there is a bug here
export async function validatePasswordResetSessionToken(
	token: string,
): Promise<PasswordResetSessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db
		.select({
			session: {
				id: password_reset_sessions.id,
				userId: password_reset_sessions.userId,
				email: password_reset_sessions.email,
				code: password_reset_sessions.code,
				expiresAt: password_reset_sessions.expiresAt,
				emailVerified: password_reset_sessions.emailVerified,
				twoFactorVerified: password_reset_sessions.twoFactorVerified,
			},
			user: {
				id: users.id,
				email: users.email,
				username: users.username,
				email_verified: users.email_verified,
				registered_2fa: users.registered_2fa,
			},
		})
		.from(password_reset_sessions)
		.innerJoin(users, eq(users.id, password_reset_sessions.userId))
		.where(eq(password_reset_sessions.id, sessionId))
		.limit(1);

	if (result.length === 0) {
		return { session: null, user: null };
	}

	const { session, user } = result[0];

	if (Date.now() >= session.expiresAt.getTime()) {
		await db
			.delete(password_reset_sessions)
			.where(eq(password_reset_sessions.id, session.id));
		return { session: null, user: null };
	}

	return {
		session,
		user: removeSensitiveUserFields(user),
	};
}

export async function setPasswordResetSessionAsEmailVerified(
	sessionId: string,
): Promise<void> {
	await db
		.update(password_reset_sessions)
		.set({ emailVerified: true })
		.where(eq(password_reset_sessions.id, sessionId));
}

export async function setPasswordResetSessionAs2FAVerified(
	sessionId: string,
): Promise<void> {
	await db
		.update(password_reset_sessions)
		.set({ twoFactorVerified: true })
		.where(eq(password_reset_sessions.id, sessionId));
}

export async function invalidateUserPasswordResetSessions(
	userId: number,
): Promise<void> {
	await db
		.delete(password_reset_sessions)
		.where(eq(password_reset_sessions.userId, userId));
}

export async function validatePasswordResetSessionRequest(): Promise<PasswordResetSessionValidationResult> {
	const token = (await cookies()).get("password_reset_session")?.value ?? null;
	if (token === null) {
		return { session: null, user: null };
	}
	const result = await validatePasswordResetSessionToken(token);
	if (result.session === null) {
		deletePasswordResetSessionTokenCookie();
	}
	return result;
}

export function setPasswordResetSessionTokenCookie(
	token: string,
	expiresAt: Date,
): void {
	(cookies() as unknown as UnsafeUnwrappedCookies).set(
		"password_reset_session",
		token,
		{
			expires: expiresAt,
			sameSite: "lax",
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "production",
		},
	);
}

export function deletePasswordResetSessionTokenCookie(): void {
	(cookies() as unknown as UnsafeUnwrappedCookies).set(
		"password_reset_session",
		"",
		{
			maxAge: 0,
			sameSite: "lax",
			httpOnly: true,
			path: "/",
			secure: process.env.NODE_ENV === "production",
		},
	);
}

export function sendPasswordResetEmail(email: string, code: string): void {
	console.log(`To ${email}: Your reset code is ${code}`);
}

export type PasswordResetSessionValidationResult =
	| { session: PasswordResetSession; user: User }
	| { session: null; user: null };
