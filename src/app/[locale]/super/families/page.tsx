import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getCurrentSession } from '@/core/auth/session';
import { getFamilies } from '@/db/access-layer/families';
import { FamiliesTable } from './families_table';
import { CSVDownloadButton } from './components/csv-download-button';

export default async function FamiliesPage() {
	const t = await getTranslations('super.families');
	const { user } = await getCurrentSession();
	const isSuperAdmin = user?.is_super_admin || false;

	const families = await getFamilies();

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">{t('title')}</h1>
				<div className="flex gap-2">
					<CSVDownloadButton />
					<Link href="/super/families/new">
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							{t('addNew')}
						</Button>
					</Link>
				</div>
			</div>

			<FamiliesTable families={families} isSuperAdmin={isSuperAdmin} />
		</div>
	);
}
