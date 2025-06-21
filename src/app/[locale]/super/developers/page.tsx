import { getTranslations } from 'next-intl/server';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from 'next/navigation';
import { DeveloperManagement } from './components/developer-management';

export default async function DevelopersPage() {
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_admin) {
		redirect('/login');
	}

	const t = await getTranslations('super.developers.page');

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="admin-page-header">
					<h1 className="admin-page-title">{t('title')}</h1>
				</div>
				<DeveloperManagement />
			</div>
		</div>
	);
} 