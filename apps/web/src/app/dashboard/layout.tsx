"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { OrganizationProvider, useOrganization } from "@/contexts/organization-context";
import { authClient } from "@/lib/auth-client";

function DashboardContent({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const { userOrgs, isLoading: orgsLoading } = useOrganization();
	const { data: session } = authClient.useSession();

	useEffect(() => {
		if (
			session &&
			!orgsLoading &&
			userOrgs.length === 0 &&
			pathname !== "/dashboard/onboarding"
		) {
			router.push("/dashboard/onboarding");
		}
	}, [session, orgsLoading, userOrgs.length, pathname, router]);

	if (orgsLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
			</div>
		);
	}

	if (userOrgs.length === 0 && pathname !== "/dashboard/onboarding") {
		return null;
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<DashboardSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 px-6 py-6 md:gap-6 md:px-8 md:py-6">
							{children}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
			</div>
		);
	}

	if (!session) {
		return null;
	}

	return (
		<OrganizationProvider>
			<DashboardContent>{children}</DashboardContent>
		</OrganizationProvider>
	);
}
