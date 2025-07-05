'use client';

import { BookUser, Building2, Terminal, Users, Home } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import * as React from 'react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const createNavData = () => {
	const t = useTranslations('super.sidebar');
	const locale = useLocale();
	const isRTL = locale === 'ar' || locale === 'he';
	
	return {
		navMain: [
			{
				title: t('users'),
				url: `/${locale}/super/users`,
				icon: Users,
				isActive: true,
				isSuperAdmin: true,
			},
			{
				title: t('properties'),
				url: `/${locale}/super/properties`,
				icon: Home,
				isActive: true,
				isSuperAdmin: false,
			},
			{
				title: t('developers'),
				url: `/${locale}/super/developers`,
				icon: Building2,
				isActive: true,
				isSuperAdmin: false,
			},
			{
				title: t('contacts'),
				url: `/${locale}/super/contacts`,
				icon: BookUser,
				isActive: true,
				isSuperAdmin: false,
			},
		],
		isRTL,
		locale,
	};
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = createNavData();

	return (
		<Sidebar 
			collapsible="icon" 
			className={`${data.isRTL ? 'border-l' : 'border-r'} bg-white shadow-lg`}
			{...props}
		>
			<SidebarContent className={`pt-4 ${data.isRTL ? 'text-right' : 'text-left'}`}>
				<div className={`p-4 border-b border-gray-200 ${data.isRTL ? 'text-right' : 'text-left'}`}>
					<h2 className="admin-subsection-title text-primary mb-0">Estatemar</h2>
				</div>
				<NavMain items={data.navMain} isRTL={data.isRTL} />
			</SidebarContent>
			<SidebarFooter className="border-t border-gray-200">
				<NavUser isRTL={data.isRTL} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
