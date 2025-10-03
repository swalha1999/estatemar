"use client";

import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";

export function OrganizationSwitcher() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const {
		data: activeOrganization,
		isPending,
		refetch: refetchActiveOrganization,
		isRefetching,
	} = authClient.useActiveOrganization();
	const {
		data: organizations,
		isPending: isOrganizationsPending,
		refetch: refetchOrganizations,
		isRefetching: isOrganizationsRefetching,
	} = authClient.useListOrganizations();

	const setActiveOrganization = useMutation(
		orpc.user.organization.setActive.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: orpc.user.organization.key(),
				});
				refetchActiveOrganization();
				refetchOrganizations();
			},
		}),
	);

	if (
		isPending ||
		isOrganizationsPending ||
		isRefetching ||
		isOrganizationsRefetching ||
		setActiveOrganization.isPending
	) {
		return (
			<div className="flex items-center space-x-2">
				<Skeleton className="h-8 w-8 rounded-full" />
				<Skeleton className="h-9 w-[180px]" />
			</div>
		);
	}

	return (
		<div className="flex items-center space-x-2">
			{activeOrganization && (
				<Avatar className="h-8 w-8">
					<AvatarImage
						src={activeOrganization.logo || ""}
						alt={activeOrganization.name}
					/>
					<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-sm text-white">
						{activeOrganization.name[0]?.toUpperCase()}
					</AvatarFallback>
				</Avatar>
			)}
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="w-[200px] justify-between"
					>
						{activeOrganization
							? activeOrganization.name
							: "Select organization..."}
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[280px] p-0">
					<Command>
						<CommandInput placeholder="Search organizations..." />
						<CommandList>
							<CommandEmpty>No organization found.</CommandEmpty>
							<CommandGroup>
								{organizations?.map((org) => (
									<CommandItem
										key={org.id}
										onSelect={() => {
											setActiveOrganization.mutate({
												organizationId: org.id,
												organizationSlug: org.slug,
											});
											setOpen(false);
										}}
										className="flex items-center space-x-3 px-2 py-2"
									>
										<Avatar className="h-6 w-6">
											<AvatarImage src={org.logo || ""} alt={org.name} />
											<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white text-xs">
												{org.name[0]?.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium">{org.name}</p>
											<p className="truncate text-muted-foreground text-xs">
												@{org.slug}
											</p>
										</div>
										<Check
											className={cn(
												"h-4 w-4 flex-shrink-0",
												activeOrganization?.id === org.id
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false);
										router.push("/dashboard/organizations/new");
									}}
									className="flex items-center space-x-3 px-2 py-2"
								>
									<div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/25 border-dashed bg-dashed">
										<Plus className="h-3 w-3 text-muted-foreground" />
									</div>
									<span className="font-medium">Create Organization</span>
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
