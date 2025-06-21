import { getTranslations } from 'next-intl/server';
import { EditFamilyForm } from './edit-family-form';
import { getFamily } from '@/db/access-layer/families';
import { notFound } from 'next/navigation';

export default async function EditFamilyPage({
	params,
}: {
	params: Promise<{ family_id: string }>;
}) {
	const { family_id } = await params;
	const t = await getTranslations('super.families.edit');
	const family = await getFamily(parseInt(family_id));

	if (!family) {
		notFound();
	}

	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-8 text-2xl font-bold">{t('edit_family')}</h1>
			<EditFamilyForm family={family} />
		</div>
	);
}
