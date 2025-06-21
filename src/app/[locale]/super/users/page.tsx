import { getLocale, getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from '@/i18n/navigation';
import { getAllUsersWithoutDevelopers } from '@/db/access-layer/users';
import { UsersTable } from './users-table';
import { CreateUserButton } from './create-user-button';

export default async function UsersPage() {
	const locale = await getLocale();
	const { session, user } = await getCurrentSession();

	if (!session || !user) {
		return redirect({ href: '/login', locale });
	}

	if (!user.is_super_admin) {
		return redirect({ href: '/super', locale });
	}

	const t = await getTranslations('super.users.page');
	const users = await getAllUsersWithoutDevelopers();

	return (
		<div className="container mx-auto py-10">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<CreateUserButton />
				</div>

				<div className="rounded-md border">
					<UsersTable users={users} currentUser={user} />
				</div>
			</div>
		</div>
	);
}
