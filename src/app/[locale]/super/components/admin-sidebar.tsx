'use client';

import { BookUser, Terminal, Users, Heart, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';

const createNavData = () => {
	const t = useTranslations('super.sidebar');
	return {
		navMain: [
			{
				title: t('users'),
				url: '/super/users',
				icon: Users,
				isActive: true,
				isSuperAdmin: true,
			},
			{
				title: t('debug'),
				url: '/super/debug',
				icon: Terminal,
				isActive: true,
				isSuperAdmin: true,
			},
			{
				title: t('contacts'),
				url: '/super/contacts',
				icon: BookUser,
				isActive: true,
				isSuperAdmin: false,
			},
			{
				title: t('families'),
				url: '/super/families',
				icon: Users,
				isActive: true,
				isSuperAdmin: false,
			},
			{
				title: t('leads'),
				url: '/super/leads',
				icon: Heart,
				isActive: true,
				isSuperAdmin: true,
			},
			{
				title: t('invitations'),
				url: '/super/invitations',
				icon: Mail,
				isActive: true,
				isSuperAdmin: true,
			},
		],
	};
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const data = createNavData();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarContent className="pt-4">
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
