"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Icon } from "@/components/icon";

import { type User } from "@/db/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sidebar as UISidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

interface SidebarProps {
    user: User;
    lng: string;
    logoutAction: () => Promise<{ message: string }>;
}

export function Sidebar({ user, lng, logoutAction }: SidebarProps) {
    const pathname = usePathname();
    const [clientIP, setClientIP] = useState<string>("");

    const sidebarNavItems = [
        {
            title: "Metrics",
            href: `/${lng}/dashboard`,
            icon: "LayoutDashboard",
        },
        {
            title: "Projects",
            href: `/${lng}/dashboard/projects`,
            icon: "Building2",
        },
        {
            title: "Users",
            href: `/${lng}/dashboard/users`,
            icon: "Users",
        },
        {
            title: "Content",
            href: `/${lng}/dashboard/content`,
            icon: "FileText",
        },
        {
            title: "Settings",
            href: `/${lng}/dashboard/settings`,
            icon: "Settings",
        },
    ];

    useEffect(() => {
        fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => setClientIP(data.ip))
            .catch(() => setClientIP("Unable to fetch IP"));
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <UISidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {sidebarNavItems.map((item) => {
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            tooltip={item.title}
                                        >
                                            <Link href={item.href}>
                                                <Icon name={item.icon} className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Profile</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="rounded-lg bg-sidebar-accent p-4">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-20 w-20 mb-4">
                                    <AvatarImage src={user.photo_url || ""} />
                                    <AvatarFallback className="text-lg">
                                        {user.username ? getInitials(user.username) : "??"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-base font-semibold">{user.username}</h4>
                                    <div className="flex flex-col gap-1 items-center justify-center text-sm text-sidebar-foreground/70">
                                        <div className="flex items-center">
                                            <Icon name="Mail" className="h-4 w-4 mr-1" />
                                            <span className="truncate max-w-[180px] text-xs">
                                                {user.email}
                                            </span>
                                        </div>
                                        <span className="text-xs">IP: {clientIP}</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 w-full flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md px-3 py-2 text-sm transition-colors"
                                    onClick={logoutAction}
                                >
                                    <Icon name="LogOut" className="h-4 w-4" />
                                    <span>Sign out</span>
                                </button>
                            </div>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </UISidebar>
    );
}
