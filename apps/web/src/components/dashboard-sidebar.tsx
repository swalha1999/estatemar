import {
	IconDashboard,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconReport,
	IconSettings,
	IconUser,
} from "@tabler/icons-react";
import type * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { OrganizationSwitcher } from "@/components/organization-switcher";
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
import { authClient } from "@/lib/auth-client";

const data = {
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
				<div className="px-2 py-2">
					<OrganizationSwitcher />
				</div>
				<SidebarSeparator className="mx-0" />
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
