import {
	IconCamera,
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconHelp,
	IconHome,
	IconReport,
	IconSearch,
	IconSettings,
	IconUser,
	IconUsers,
} from "@tabler/icons-react";
import type * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
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
			title: "Analytics",
			url: "#" as const,
			icon: IconChartBar,
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
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function DashboardSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { data: session } = authClient.useSession();

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
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
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
