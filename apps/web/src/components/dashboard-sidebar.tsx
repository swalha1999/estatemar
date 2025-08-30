import {
	IconCamera,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconHome,
	IconReport,
	IconSettings,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import type * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { OrgSwitcher } from "@/components/org-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { useOrganization } from "@/contexts/organization-context";
import { authClient } from "@/lib/auth-client";

const data = {
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard" as const,
			icon: IconDashboard,
		},
		{
			title: "My Properties",
			url: "/dashboard/properties" as const,
			icon: IconHome,
		},
		{
			title: "Profile",
			url: "/dashboard/profile" as const,
			icon: IconUser,
		},
		{
			title: "Team",
			url: "#" as const,
			icon: IconUsers,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
			disabled: true,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
			disabled: true,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
			disabled: true,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
			disabled: true,
		},
	],
};

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();

	const navigationItems = [
		{
			title: "Dashboard",
			url: "/dashboard" as const,
			icon: IconDashboard,
		},
		{
			title: "Properties",
			url: "/dashboard/properties" as const,
			icon: IconHome,
		},
		{
			title: "Team",
			url: "/dashboard/team" as const,
			icon: IconUsers,
		},
	];

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<a href="/dashboard">
								<span className="font-semibold text-base">Estatemar</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarSeparator className="mx-0" />
				<div className="px-2">
					<OrgSwitcher />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigationItems} />
				<NavDocuments items={data.documents} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						name: session?.user.name || "username",
						email: session?.user.email || "email@email.com",
						avatar: session?.user.image || "",
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	);
}
