import { getTranslations } from 'next-intl/server';
import { CreatePropertyForm } from './components/create-property-form';

export default async function CreatePropertyPage() {
	const t = await getTranslations('properties');

	return (
		<div className="container mx-auto py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">{t('create.title')}</h1>
				<p className="text-muted-foreground">{t('create.description')}</p>
			</div>
			<CreatePropertyForm />
		</div>
	);
} 