"use client";

import Image from "next/image";
import type * as React from "react";
import { Icon } from "@/components/icon";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import type { User } from "@/db/schema";
import logo from "$/logo.png";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({
	lng,
	user,
	...props
}: React.ComponentProps<typeof Sidebar> & { lng: string; user: User }) {
	const data = {
		user: user,
		navMain: [
			{
				title: "Metrics",
				url: `/${lng}/dashboard`,
				icon: "ChartNoAxesCombined",
				items: [
					{
						title: "Articles Views",
						url: `/${lng}/dashboard/articles-views`,
					},
				],
			},
			{
				title: "Projects",
				url: `/${lng}/dashboard/projects`,
				icon: "Building2",
				items: [],
			},
			{
				title: "Articles",
				url: `/${lng}/dashboard/articles`,
				icon: "FileText",
				items: [],
			},
			{
				title: "Users",
				url: `/${lng}/dashboard/users`,
				icon: "Users",
				items: [],
			},
			{
				title: "Content",
				url: `/${lng}/dashboard/content`,
				icon: "LayoutDashboard",
				items: [],
			},
			{
				title: "Settings",
				url: `/${lng}/dashboard/settings`,
				icon: "Settings",
				items: [],
			},
			{
				title: "Developers",
				url: `/${lng}/dashboard/developers`,
				icon: "Warehouse",
				items: [],
			},
			{
				title: "Amenities",
				url: `/${lng}/dashboard/amenities`,
				icon: "Coffee",
				items: [],
			},
			{
				title: "Leads",
				url: `/${lng}/dashboard/leads`,
				icon: "UserPlus",
				items: [
					{
						title: "Updates Leads",
						url: `/${lng}/dashboard/leads/updates`,
					},
					{
						title: "Partner Leads",
						url: `/${lng}/dashboard/leads/partner`,
					},
				],
			},
		],
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Image src={logo} alt={"logo"} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
