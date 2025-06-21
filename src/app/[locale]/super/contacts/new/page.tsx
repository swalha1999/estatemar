import { getCurrentSession } from '@/core/auth/session';
import { db } from '@/db';
import { getTranslations } from 'next-intl/server';
import { AddContactForm } from './add-contact-form';
import { redirect } from 'next/navigation';

export default async function NewContactPage() {
	const t = await getTranslations('super.contacts.new_contacts');
	const { session, user } = await getCurrentSession();

	if (!session || !user) {
		redirect('/super/login');
	}

	const families = await db.query.families.findMany(); // TODO: refactor this to the access layer

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<h1 className="text-3xl font-bold">{t('add_contact')}</h1>
			</div>

			<div className="grid grid-cols-1 gap-8">
				<AddContactForm families={families} />
			</div>

		</div>
	);
}
