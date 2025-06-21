import { getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from 'next/navigation';

export default async function Page() {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_admin) {
		redirect('/login');
	}

	const t = await getTranslations('super.page');

	return (
		<div>
			<h1>{t('welcome')}</h1>
		</div>
	);
}
