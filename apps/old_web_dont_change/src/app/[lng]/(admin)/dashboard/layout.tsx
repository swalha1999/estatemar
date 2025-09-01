import { redirect } from "next/navigation";
import type React from "react";
import { Sidebar } from "@/app/[lng]/(admin)/dashboard/components/sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentSession } from "@/utils/auth/session";
import { logoutAction } from "./actions";
import { AppSidebar } from "./components/app-sidebar";

export default async function DashboardLayout(props: {
	children: React.ReactNode;
	params: Promise<{ lng: string }>;
}) {
	const params = await props.params;

	const { lng } = params;

	const { children } = props;

	const { session, user } = await getCurrentSession();

	if (!session) {
		return redirect("/login");
	}

	return (
		<>
			<SidebarProvider>
				<AppSidebar lng={lng} user={user} />
				<SidebarInset>
					<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
						<div className="flex items-center gap-2 px-4">
							<SidebarTrigger className="-ml-1" />
							<Separator orientation="vertical" className="mr-2 h-4" />
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">
											Building Your Application
										</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Data Fetching</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
				</SidebarInset>
			</SidebarProvider>
			<Toaster />
		</>
	);
}
