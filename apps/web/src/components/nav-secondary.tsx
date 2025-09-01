"use client";

import type { Icon } from "@tabler/icons-react";
import type * as React from "react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: Icon;
		disabled?: boolean;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild={!item.disabled}
								disabled={item.disabled}
								className={item.disabled ? "cursor-not-allowed opacity-50" : ""}
							>
								{item.disabled ? (
									<div className="flex items-center gap-2 px-3 py-2 text-sm">
										<item.icon className="size-4" />
										<span>{item.title}</span>
									</div>
								) : (
									<a href={item.url}>
										<item.icon className="size-4" />
										<span>{item.title}</span>
									</a>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
