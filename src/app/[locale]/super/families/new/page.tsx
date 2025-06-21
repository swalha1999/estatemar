import { getTranslations } from 'next-intl/server';
import { AddFamilyForm } from './add-family-form';

export default async function FamiliesPage() {
	const t = await getTranslations('super.families.new');
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-8 text-2xl font-bold">{t('add_family')}</h1>
			<AddFamilyForm />
		</div>
	);
}
