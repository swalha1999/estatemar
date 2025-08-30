"use client";

import { Building, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOrganization } from "@/contexts/organization-context";

export function OrgSwitcher() {
	const { currentOrg, userOrgs, switchOrg, isLoading } = useOrganization();

	if (isLoading) {
		return (
			<div className="flex items-center space-x-2 px-2 py-1.5">
				<div className="h-6 w-6 animate-pulse rounded-full bg-gray-200" />
				<div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
			</div>
		);
	}

	const getOrgInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getOrgIcon = () => {
		return <Building className="h-4 w-4" />;
	};

	return (
		<Select
			value={currentOrg?.id || ""}
			onValueChange={(value) => switchOrg(value)}
		>
			<SelectTrigger className="w-full border-none shadow-none hover:bg-sidebar-accent">
				<div className="flex items-center space-x-2">
					<Avatar className="h-6 w-6">
						{currentOrg?.image ? (
							<AvatarImage src={currentOrg.image} alt={currentOrg.name} />
						) : (
							<AvatarFallback className="text-xs">
								{getOrgInitials(currentOrg?.name || "")}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="flex flex-col items-start">
						<span className="max-w-32 truncate font-medium text-sm">
							{currentOrg?.name || "Select Organization"}
						</span>
						<span className="text-muted-foreground text-xs capitalize">
							{currentOrg?.memberRole}
						</span>
					</div>
				</div>
			</SelectTrigger>
			<SelectContent>
				{userOrgs.map((org) => (
					<SelectItem key={org.id} value={org.id}>
						<div className="flex items-center space-x-2">
							<Avatar className="h-5 w-5">
								{org.image ? (
									<AvatarImage src={org.image} alt={org.name} />
								) : (
									<AvatarFallback className="text-xs">
										{getOrgInitials(org.name)}
									</AvatarFallback>
								)}
							</Avatar>
							<div className="flex flex-col">
								<span className="font-medium text-sm">{org.name}</span>
								<span className="text-muted-foreground text-xs capitalize">
									{org.memberRole}
								</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
