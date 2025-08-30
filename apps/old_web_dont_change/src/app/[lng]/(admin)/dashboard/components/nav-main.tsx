"use client";

import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
export function NavMain({
    items,
}: {
    items: {
        title: string;
        url: string;
        icon?: string;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    const router = useRouter();
    const { open } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={item.isActive}
                        className="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                    tooltip={item.title}
                                    onClick={() => {
                                        if (item.url && item.items && item.items.length === 0) {
                                            router.push(item.url);
                                            return;
                                        }
                                        if (!open) {
                                            router.push(item.url);
                                            return;
                                        }
                                    }}
                                >
                                    {item.icon && <Icon name={item.icon} />}
                                    <span>{item.title}</span>
                                    {item.items && item.items.length > 0 && (
                                        <Icon
                                            name="ChevronRight"
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                        />
                                    )}
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {item.items && item.items.length > 0 && (
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild>
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
