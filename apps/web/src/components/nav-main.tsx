import { type Icon, IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import Link, { type LinkProps } from "next/link";
import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: LinkProps<RouteType>["href"];
		icon?: Icon;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
						>
							<IconCirclePlusFilled />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Button
							size="icon"
							className="size-8 group-data-[collapsible=icon]:opacity-0"
							variant="outline"
						>
							<IconMail />
							<span className="sr-only">Inbox</span>
						</Button>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link href={item.url} className="flex w-full">
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</SidebarMenuButton>
							</Link>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
