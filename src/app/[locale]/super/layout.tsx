import { Metadata } from 'next';
import React from 'react';
import { getLocale, getTranslations } from 'next-intl/server';

import { AdminSidebar } from './components/admin-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { getCurrentSession } from '@/core/auth/session';
import { redirect } from '@/i18n/navigation';
import { BreadcrumbLayout } from '@/components/layouts/admin_page_layout';

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('super.metadata');
	return {
		title: t('title'),
		description: t('description'),
	};
}

export default async function AdminLayout(props: { children: React.ReactNode }) {
	const locale = await getLocale();
	const { session, user } = await getCurrentSession();
	if (!session || !user || !user.is_admin) {
		redirect({ href: '/login', locale: locale ?? 'he' });
	}

	// Determine direction based on locale
	const isRTL = locale === 'ar' || locale === 'he';
	const direction = isRTL ? 'rtl' : 'ltr';
	const sidebarSide = isRTL ? 'right' : 'left';

	return (
		<main dir={direction} className={`min-h-screen bg-gray-50 ${isRTL ? 'font-arabic' : 'font-latin'}`}>
			<SidebarProvider>
				<AdminSidebar side={sidebarSide} />
				<SidebarInset>
					<BreadcrumbLayout>{props.children}</BreadcrumbLayout>
				</SidebarInset>
			</SidebarProvider>
		</main>
	);
}
