'use client';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@/components/ui/sidebar';
import { Grid2X2, HeadphonesIcon, PenTool } from 'lucide-react';
import * as React from 'react';

const teacherNav = [
	{
		title: 'לוח מחוונים',
		url: '/dashboard',
		icon: Grid2X2,
	},
	{
		title: 'תמיכה',
		url: '/dashboard/support',
		icon: HeadphonesIcon,
	},
];

export function TeacherSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			// className="bg-background text-white border-none fixed right-0 [&_a]:text-white [&_a:hover]:bg-white/10 [&_a]:rounded-lg [&_svg]:text-white [&_svg]:h-7 [&_svg]:w-7 [&_span]:text-lg"
			collapsible="icon"
			{...props}
		>
			<SidebarHeader className="flex items-center justify-between border-b border-sidebar-border py-4">
				<div className="flex items-center gap-2">
					<PenTool className="h-8 w-8" />
					<span className="text-xl font-semibold">בוסאליה</span>
				</div>
			</SidebarHeader>
			<SidebarContent className="py-4">
				<NavMain items={teacherNav} />
			</SidebarContent>
			<SidebarFooter className="border-t border-sidebar-border py-4">
				<NavUser />
			</SidebarFooter>
			<SidebarRail className="border-none bg-sidebar" />
		</Sidebar>
	);
}
