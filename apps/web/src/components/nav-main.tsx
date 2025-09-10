import { type Icon, IconCirclePlusFilled, IconMail } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import type { RouteType } from "next/dist/lib/load-custom-routes";
import Link, { type LinkProps } from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: LinkProps<RouteType>["href"];
		icon?: Icon;
	}[];
}) {
	const { data: invitations = [] } = useQuery(
		orpc.auth.organization.getUserInvitations.queryOptions()
	);

	// Count received invitations (not sent by current user)
	const notificationCount = Array.isArray(invitations)
		? invitations.filter(
			(invitation) =>
				invitation.status === "pending",
		).length
		: 0;
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<SidebarMenuItem className="flex items-center gap-2">
						<SidebarMenuButton
							tooltip="Quick Create"
							className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
						>
							<IconCirclePlusFilled className="size-4" />
							<span>Quick Create</span>
						</SidebarMenuButton>
						<Link href="/dashboard/notifications">
							<Button
								size="icon"
								className="relative size-8 group-data-[collapsible=icon]:opacity-0"
								variant="outline"
							>
								<Bell className="size-4" />
								{notificationCount > 0 && (
									<Badge
										className="-right-1 -top-1 absolute h-4 w-4 rounded-full p-0 font-bold text-xs"
										variant="default"
									>
										{notificationCount > 9 ? "9+" : notificationCount}
									</Badge>
								)}
								<span className="sr-only">
									Notifications ({notificationCount})
								</span>
							</Button>
						</Link>
					</SidebarMenuItem>
				</SidebarMenu>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<Link href={item.url} className="flex w-full">
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon className="size-4" />}
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
