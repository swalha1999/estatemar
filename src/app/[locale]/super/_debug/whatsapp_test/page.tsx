import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import HallInviteTestForm from './components/hall-invite-test-form';


export default async function WhatsAppTestPage() {
	const t = await getTranslations('admin.page.debug.whatsapp_test');

	return (
		<div className="flex min-h-screen justify-center">
			<div className="container max-w-2xl py-6">
				<div className="mb-8 flex flex-col items-center gap-2 text-center">
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<p className="text-muted-foreground">{t('description')}</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>{t('send_test_message')}</CardTitle>
						<CardDescription>{t('send_test_message_desc')}</CardDescription>
					</CardHeader>
					<CardContent>
						<HallInviteTestForm />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
