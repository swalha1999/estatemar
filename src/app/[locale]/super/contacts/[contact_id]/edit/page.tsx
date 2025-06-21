import { getContactById } from '@/db/access-layer/contacts';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { EditContactForm } from './edit-contact-form';
import { getFamilies } from '@/db/access-layer/families';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from 'next/navigation';


export default async function EditContactPage({
	params,
}: {
	params: Promise<{ contact_id: string }>;
}) {
	const { contact_id } = await params;
	const { session, user } = await getCurrentSession();

	if (session === null || user === null) {
		redirect('/login');
	}

	const t = await getTranslations('super.contacts.edit_contact_form');

	const contact = await getContactById(parseInt(contact_id));
	if (!contact) {
		notFound();
	}

	if (contact.addedBy !== user?.id && !user?.is_super_admin) {
		redirect('/super/contacts');
	}

	const families = await getFamilies();

	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<h1 className="text-3xl font-bold">{t('page_title')}</h1>
			</div>

			<div className="grid grid-cols-1 gap-8">
				<EditContactForm contact={contact} families={families} />
			</div>
		</div>
	);
}
