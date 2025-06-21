import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function DebugPage() {
	const t = await getTranslations('admin.page.debug');

	return (
		<div className="flex min-h-screen justify-center">
			<div className="container max-w-5xl py-6">
				<div className="mb-8 flex flex-col items-center gap-2 text-center">
					<h1 className="text-3xl font-bold">{t('title')}</h1>
					<p className="text-muted-foreground">{t('description')}</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('colors')}</CardTitle>
							<CardDescription>{t('colors_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/colors">{t('open_colors')}</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('buttons')}</CardTitle>
							<CardDescription>{t('buttons_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/buttons">{t('open_buttons')}</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('icons')}</CardTitle>
							<CardDescription>{t('icons_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/icons">{t('open_icons')}</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('toasts')}</CardTitle>
							<CardDescription>{t('toasts_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/toasts">{t('open_toasts')}</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('system_info')}</CardTitle>
							<CardDescription>
								Node.js: {process.version}
								<br />
								Next.js: {process.env.NEXT_RUNTIME}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="text-sm text-muted-foreground">
								{t('debug_mode')}{' '}
								{process.env.DEBUG === 'true' ? t('enabled') : t('disabled')}
							</div>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('whatsapp_test.title')}</CardTitle>
							<CardDescription>{t('whatsapp_test_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/whatsapp_test">
									{t('open_whatsapp_test')}
								</Link>
							</Button>
						</CardContent>
					</Card>

					<Card className="h-full">
						<CardHeader>
							<CardTitle>{t('upload_test')}</CardTitle>
							<CardDescription>{t('upload_test_desc')}</CardDescription>
						</CardHeader>
						<CardContent>
							<Button asChild className="w-full">
								<Link href="/super/debug/upload">{t('open_upload_test')}</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
