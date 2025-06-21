'use server';

import { toggleUserAdmin, toggleUserSuperAdmin } from '@/db/access-layer/users';
import { ActionResult } from '@/types/actionType';
import { generateSessionToken, invalidateSession, createSession, getCurrentSession, setSessionTokenCookie } from '@/core/auth/session';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { updateUserPassword } from '@/core/auth/user';
import { verifyPasswordStrength } from '@/core/auth/password';
import { createUser, verifyUsernameInput } from '@/core/auth/user';
import { verifyEmailInput } from '@/core/auth/email';
import { getUserFromEmail } from '@/core/auth/user';
import { updateUser } from '@/db/access-layer/users';
import { deleteUser } from '@/db/access-layer/users';

export async function toggleAdminAction(userId: number): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	try {
		await toggleUserAdmin(userId);
		revalidatePath('/super/users');
		return { is_success: true, message: 'success' };
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}

export async function toggleSuperAdminAction(userId: number): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	try {
		await toggleUserSuperAdmin(userId);
		revalidatePath('/super/users');
		return { is_success: true, message: 'success' };
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}

export async function loginAsUserAction(userId: number): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	try {
		// remove the current session
		await invalidateSession(session.id);
		// create a new session for the user
		const sessionToken = generateSessionToken();
		const newSession = await createSession(sessionToken, userId, {
			twoFactorVerified: false,
		});
		// set the new session token in the cookie
		setSessionTokenCookie(sessionToken, newSession.expiresAt);
		// redirect to the dashboard
		redirect('/dashboard');
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}

export async function changeUserPasswordAction(userId: number, newPassword: string): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	if (!newPassword || newPassword.trim() === '') {
		return { is_success: false, message: 'error' };
	}

	if (!(await verifyPasswordStrength(newPassword))) {
		return { is_success: false, message: 'error' };
	}

	try {
		await updateUserPassword(userId, newPassword);
		revalidatePath('/super/users');
		return { is_success: true, message: 'success' };
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}

export async function createUserAction(formData: {
	username: string;
	email: string;
	password: string;
	isAdmin: boolean;
	isSuperAdmin: boolean;
}): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	const { username, email, password, isAdmin, isSuperAdmin } = formData;

	if (!username || !email || !password) {
		return { is_success: false, message: 'error' };
	}

	if (!verifyUsernameInput(username)) {
		return { is_success: false, message: 'error' };
	}

	if (!verifyEmailInput(email)) {
		return { is_success: false, message: 'error' };
	}

	if (!(await verifyPasswordStrength(password))) {
		return { is_success: false, message: 'error' };
	}

	try {
		const newUser = await createUser(email, username, password);
		
		// Update the user to set email as verified and permissions
		await updateUser(newUser.id, {
			email_verified: true,
			is_admin: isAdmin,
			is_super_admin: isSuperAdmin,
		});

		revalidatePath('/super/users');
		return { is_success: true, message: 'success' };
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}

export async function deleteUserAction(userId: number): Promise<ActionResult> {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_super_admin) {
		redirect('/login');
	}

	// Prevent super admin from deleting themselves
	if (userId === user.id) {
		return { is_success: false, message: 'error' };
	}

	try {
		await deleteUser(userId);
		revalidatePath('/super/users');
		return { is_success: true, message: 'success' };
	} catch (error) {
		return { is_success: false, message: 'error' };
	}
}
