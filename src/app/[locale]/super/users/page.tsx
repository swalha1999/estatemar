import { getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from 'next/navigation';
import { getAllUsersWithoutDevelopers } from '@/db/access-layer/users';
import { UsersTable } from './users-table';
import { CreateUserButton } from './create-user-button';

export default async function UsersPage() {
	const { session, user } = await getCurrentSession();

	if (!session || !user) {
		redirect('/login');
	}

	if (!user.is_super_admin) {
		redirect('/super');
	}

	const t = await getTranslations('super.users');
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
