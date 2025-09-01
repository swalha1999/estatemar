import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { type User, users } from "@/db/schema";
import { decryptString, encryptString } from "@/utils/auth/encryption";
import { hashPassword } from "@/utils/auth/password";
import { generateRandomRecoveryCode } from "@/utils/auth/utils";

export function verifyUsernameInput(username: string): boolean {
	return (
		username.length > 3 && username.length < 32 && username.trim() === username
	);
}

export async function createUser(
	email: string,
	username: string,
	password: string,
): Promise<User> {
	const passwordHash = await hashPassword(password);
	const recoveryCode = generateRandomRecoveryCode();
	const encryptedRecoveryCode = encryptString(recoveryCode);
	let newUser;
	try {
		newUser = await db
			.insert(users)
			.values({
				email,
				username,
				password_hash: passwordHash,
				recovery_code: encryptedRecoveryCode,
				email_verified: false,
			})
			.returning();
	} catch (error) {
		console.error(error);
		throw new Error("Failed to create user");
	}

	if (!newUser || newUser.length === 0) {
		throw new Error("Failed to create user");
	}

	const user: Partial<User> = {
		id: newUser[0].id,
		username,
		email,
		email_verified: false,
		registered_2fa: false,
	};

	return removeSensitiveUserFields(user);
}

export async function createUserWithGoogleId(
	googleId: string,
	email: string,
	username: string,
	profilePicture: string,
): Promise<User> {
	const newUser = await db
		.insert(users)
		.values({
			email,
			username,
			google_id: googleId,
			photo_url: profilePicture,
			email_verified: true,
		})
		.returning();

	const user: Partial<User> = {
		id: newUser[0].id,
		username,
		email,
		email_verified: true,
		google_id: googleId,
	};

	return removeSensitiveUserFields(user);
}

export async function updateUserPassword(
	userId: number,
	password: string,
): Promise<void> {
	const passwordHash = await hashPassword(password);
	await db
		.update(users)
		.set({ password_hash: passwordHash })
		.where(eq(users.id, userId));
}

export async function updateUserEmailAndSetEmailAsVerified(
	userId: number,
	email: string,
): Promise<void> {
	await db
		.update(users)
		.set({
			email: email,
			email_verified: true,
		})
		.where(eq(users.id, userId));
}

export async function setUserAsEmailVerifiedIfEmailMatches(
	userId: number,
	email: string,
): Promise<boolean> {
	const result = await db
		.update(users)
		.set({ email_verified: true })
		.where(and(eq(users.id, userId), eq(users.email, email)));
	return (result.rowCount ?? 0) > 0;
}

export async function getUserPasswordHash(userId: number): Promise<string> {
	const result = await db
		.select({ passwordHash: users.password_hash })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (result.length === 0) {
		throw new Error("Invalid user ID");
	}

	if (result[0].passwordHash === null) {
		throw new Error("Password hash not found");
	}

	return result[0].passwordHash;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
	const result = await db
		.select({ recoveryCode: users.recovery_code })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (result.length === 0) {
		throw new Error("Invalid user ID");
	}

	if (result[0].recoveryCode === null) {
		throw new Error("Recovery code not found");
	}

	return decryptString(result[0].recoveryCode);
}

export async function getUserTOTPString(
	userId: number,
): Promise<string | null> {
	const result = await db
		.select({ totpKey: users.totp_key })
		.from(users)
		.where(eq(users.id, userId))
		.limit(1);

	if (result.length === 0) {
		throw new Error("Invalid user ID");
	}

	const encrypted = result[0].totpKey;
	if (encrypted === null) {
		return null;
	}
	return decryptString(encrypted);
}

export async function updateUserTOTPKey(
	userId: number,
	key: string,
): Promise<void> {
	const encrypted = encryptString(key);
	await db
		.update(users)
		.set({
			totp_key: encrypted,
			registered_2fa: true,
		})
		.where(eq(users.id, userId));
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
	const recoveryCode = generateRandomRecoveryCode();
	const encrypted = encryptString(recoveryCode);
	await db
		.update(users)
		.set({ recovery_code: encrypted })
		.where(eq(users.id, userId));
	return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
	const result = await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			email_verified: users.email_verified,
			registered_2fa: users.registered_2fa,
		})
		.from(users)
		.where(eq(users.email, email))
		.limit(1);

	if (result.length === 0) {
		return null;
	}

	const user = result[0];
	return removeSensitiveUserFields(user);
}

export async function getUserFromGoogleId(
	googleId: string,
): Promise<User | null> {
	const result = await db
		.select({
			id: users.id,
			email: users.email,
			username: users.username,
			email_verified: users.email_verified,
			registered_2fa: users.registered_2fa,
		})
		.from(users)
		.where(eq(users.google_id, googleId))
		.limit(1);

	if (result.length === 0) {
		return null;
	}

	const user = result[0];
	return removeSensitiveUserFields(user);
}

export async function deleteUser(userId: number): Promise<void> {
	await db.delete(users).where(eq(users.id, userId));
}

export function removeSensitiveUserFields(user: Partial<User>): User {
	const safeUser: Partial<User> = {
		id: user.id,
		email: user.email,
		username: user.username,
		email_verified: user.email_verified,
		registered_2fa: user.registered_2fa,
		google_id: user.google_id,
		photo_url: user.photo_url,
	};

	// Remove undefined properties
	Object.keys(safeUser).forEach((key) => {
		if (safeUser[key as keyof User] === undefined) {
			delete safeUser[key as keyof User];
		}
	});

	return safeUser as User;
}
