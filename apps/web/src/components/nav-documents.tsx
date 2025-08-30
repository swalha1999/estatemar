"use client";

import {
	type Icon,
	IconDots,
	IconFolder,
	IconShare3,
	IconTrash,
} from "@tabler/icons-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function NavDocuments({
	items,
}: {
	items: {
		name: string;
		url: string;
		icon: Icon;
		disabled?: boolean;
	}[];
}) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Documents</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton 
							asChild={!item.disabled}
							disabled={item.disabled}
							className={item.disabled ? "opacity-50 cursor-not-allowed" : ""}
						>
							{item.disabled ? (
								<div className="flex items-center gap-2 px-3 py-2 text-sm">
									<item.icon className="size-4" />
									<span>{item.name}</span>
								</div>
							) : (
								<a href={item.url}>
									<item.icon className="size-4" />
									<span>{item.name}</span>
								</a>
							)}
						</SidebarMenuButton>
						{!item.disabled && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuAction
										showOnHover
										className="rounded-sm data-[state=open]:bg-accent"
									>
										<IconDots />
										<span className="sr-only">More</span>
									</SidebarMenuAction>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-24 rounded-lg"
									side={isMobile ? "bottom" : "right"}
									align={isMobile ? "end" : "start"}
								>
									<DropdownMenuItem>
										<IconFolder />
										<span>Open</span>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<IconShare3 />
										<span>Share</span>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive">
										<IconTrash />
										<span>Delete</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
