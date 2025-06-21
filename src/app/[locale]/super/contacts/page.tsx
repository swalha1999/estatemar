import { getTranslations } from 'next-intl/server';
import { ContactsList } from './contacts-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getCurrentSession } from '@/core/auth/session';
import dal from '@/db/access-layer-v2';
import { type ContactSearchParams } from '@/db/access-layer-v2/interfaces/contact.interface';
import { redirect } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';

export default async function ContactsPage({
	searchParams,
}: {
	searchParams?: Promise<ContactSearchParams>;
}) {
	const { user, session } = await getCurrentSession();
	if (!user || !session || (!user.is_admin && !user.is_super_admin)) {
		redirect('/login');
	}

	const t = await getTranslations('super.contacts');

	const towns = await dal.households.getUniqueTowns();
	const streets = await dal.households.getUniqueStreets();
	const families = await dal.families.getUniqueFamilies();

	const params = searchParams ? await searchParams : {};

	const { contacts, total } = await dal.contacts.getAllContactsForAdmin(params);
	const stats = await dal.contacts.getContactsStats(params);
	const limit = params.limit ? parseInt(params.limit, 10) : 100;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto py-6 px-4">
				{/* Header Section */}
				<div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
							<Users className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
							<p className="text-muted-foreground">إدارة جهات الاتصال والموافقات</p>
						</div>
					</div>
					<Button asChild size="lg" className="flex items-center gap-2">
						<Link href="/super/contacts/new">
							<UserPlus className="h-4 w-4" />
							{t('add_contact')}
						</Link>
					</Button>
				</div>

				{/* Main Content */}
				<ContactsList
					contacts={contacts}
					towns={towns}
					streets={streets}
					families={families}
					stats={stats}
					totalPages={Math.ceil(total / limit)}
					totalContacts={total}
					searchParams={params}
				/>
			</div>
		</div>
	);
}
