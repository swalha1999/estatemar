"use client";

import { Building2, Check, ChevronsUpDown, Plus, User } from "lucide-react";
import { useState } from "react";
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
import { useOrganization } from "@/contexts/organization-context";

export function OrganizationSwitcher() {
	const [open, setOpen] = useState(false);
	const { currentOrg, organizations, switchOrganization, isLoading } =
		useOrganization();

	if (isLoading) {
		return (
			<div className="flex h-10 w-full animate-pulse rounded-md bg-muted" />
		);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					<div className="flex min-w-0 items-center gap-2">
						{currentOrg?.type === "personal" ? (
							<User className="h-4 w-4 flex-shrink-0" />
						) : (
							<Building2 className="h-4 w-4 flex-shrink-0" />
						)}
						<span className="truncate">
							{currentOrg?.name || "Select organization"}
						</span>
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-64 p-0">
				<Command>
					<CommandInput placeholder="Search organizations..." />
					<CommandList>
						<CommandEmpty>No organizations found.</CommandEmpty>

						{organizations.some((org) => org.type === "personal") && (
							<CommandGroup heading="Personal">
								{organizations
									.filter((org) => org.type === "personal")
									.map((org) => (
										<CommandItem
											key={org.id}
											value={org.name}
											onSelect={() => {
												switchOrganization(org.id);
												setOpen(false);
											}}
										>
											<User className="mr-2 h-4 w-4" />
											<span className="flex-1 truncate">{org.name}</span>
											<Check
												className={`ml-2 h-4 w-4 ${
													currentOrg?.id === org.id
														? "opacity-100"
														: "opacity-0"
												}`}
											/>
										</CommandItem>
									))}
							</CommandGroup>
						)}

						{organizations.some((org) => org.type === "team") && (
							<CommandGroup heading="Teams">
								{organizations
									.filter((org) => org.type === "team")
									.map((org) => (
										<CommandItem
											key={org.id}
											value={org.name}
											onSelect={() => {
												switchOrganization(org.id);
												setOpen(false);
											}}
										>
											<Building2 className="mr-2 h-4 w-4" />
											<div className="flex min-w-0 flex-1 flex-col">
												<span className="truncate">{org.name}</span>
												<span className="text-muted-foreground text-xs capitalize">
													{org.role}
												</span>
											</div>
											<Check
												className={`ml-2 h-4 w-4 ${
													currentOrg?.id === org.id
														? "opacity-100"
														: "opacity-0"
												}`}
											/>
										</CommandItem>
									))}
							</CommandGroup>
						)}

						<CommandSeparator />
						<CommandGroup>
							<CommandItem
								onSelect={() => {
									// TODO: Open create organization dialog
									console.log("Create organization clicked");
									setOpen(false);
								}}
							>
								<Plus className="mr-2 h-4 w-4" />
								Create organization
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
