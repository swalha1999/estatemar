'use server';

import type { SafeUser } from '@/db/schema-auth';
import type { ActionResult } from '@/types/actionType';
import {
	deleteSessionTokenCookie,
	getCurrentSession,
	invalidateSession,
} from '@/core/auth/session';
import { redirect } from 'next/navigation';

export async function getSession() {
	const { user: sessionUser } = await getCurrentSession();
	if (!sessionUser) return null;

	const safeUser: SafeUser = {
		id: sessionUser.id,
		email: sessionUser.email,
		username: sessionUser.username,
		email_verified: sessionUser.email_verified,
		registered_2fa: sessionUser.registered_2fa,
		google_id: sessionUser.google_id,
		photo_url: sessionUser.photo_url,
		is_admin: sessionUser.is_admin,
		is_super_admin: sessionUser.is_super_admin,
		is_developer: sessionUser.is_developer,
	};

	return safeUser;
}

export async function logout(): Promise<ActionResult> {
	const { session } = await getCurrentSession();
	await deleteSessionTokenCookie();
	if (session) {
		await invalidateSession(session.id);
	}
	return {
		message: 'تم تسجيل الخروج',
	};
}

export async function protectedPage(onlyAdmin: boolean = false) {
	const { session, user } = await getCurrentSession();
	if (!session || !user) {
		return redirect('/login');
	}
	if (onlyAdmin && !user.is_admin) {
		return redirect('/');
	}
}
