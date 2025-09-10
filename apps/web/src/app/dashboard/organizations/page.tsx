"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Building2, Calendar, Mail, Plus, Users, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { OrganizationMembers } from "@/components/organization/organization-members";
import { OrganizationSwitcher } from "@/components/organization/organization-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export default function OrganizationsPage(): React.JSX.Element {
	const {
		data: organizations,
		isPending,
		isRefetching,
	} = authClient.useListOrganizations();
	const {
		data: activeOrganization,
		isPending: isActiveOrganizationPending,
		isRefetching: isActiveOrganizationRefetching,
	} = authClient.useActiveOrganization();

	const { data: session } = authClient.useSession();
	const {
		data: invitations = [],
		isPending: isInvitationsLoading,
		refetch: refetchInvitations,
	} = useQuery(orpc.auth.organization.getInvitations.queryOptions());

	const cancelInvitationMutation = useMutation(
		orpc.auth.organization.cancelInvitation.mutationOptions({
			onSuccess: () => {
				toast.success("Invitation cancelled successfully!");
				queryClient.invalidateQueries({
					queryKey: orpc.auth.organization.key(),
				});
				refetchInvitations();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to cancel invitation");
			},
		}),
	);

	// Filter invitations sent by current user
	const sentInvitations = Array.isArray(invitations)
		? invitations.filter(
				(invitation: any) =>
					invitation.inviterId === session?.user?.id &&
					invitation.status === "pending",
			)
		: [];

	const handleCancelInvitation = (invitationId: string) => {
		cancelInvitationMutation.mutate({ invitationId });
	};

	return (
		<div className="container mx-auto space-y-8 py-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Organizations</h1>
					<p className="text-muted-foreground">
						Manage your organizations and team members.
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<OrganizationSwitcher />
					<Button asChild>
						<Link href="/dashboard/organizations/new">
							<Plus className="mr-2 h-4 w-4" />
							New Organization
						</Link>
					</Button>
				</div>
			</div>

			{/* Organizations Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{isPending ||
				isActiveOrganizationPending ||
				isRefetching ||
				isActiveOrganizationRefetching ||
				isInvitationsLoading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Card key={i} className="overflow-hidden">
							<CardHeader className="pb-3">
								<div className="flex items-start space-x-3">
									<Skeleton className="h-10 w-10 rounded" />
									<div className="flex-1 space-y-2">
										<Skeleton className="h-5 w-[140px]" />
										<Skeleton className="h-4 w-[100px]" />
									</div>
									<Skeleton className="h-5 w-[50px]" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-[80px]" />
									<Skeleton className="h-3 w-[120px]" />
								</div>
							</CardContent>
						</Card>
					))
				) : organizations?.length === 0 ? (
					<Card className="col-span-full">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
							<h3 className="mb-2 font-semibold text-lg">
								No organizations yet
							</h3>
							<p className="mb-6 text-center text-muted-foreground">
								Create your first organization to get started with team
								collaboration.
							</p>
							<Button asChild>
								<Link href="/dashboard/organizations/new">
									<Plus className="mr-2 h-4 w-4" />
									Create Your First Organization
								</Link>
							</Button>
						</CardContent>
					</Card>
				) : (
					organizations?.map((org) => (
						<Card
							key={org.id}
							className={`group relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
								activeOrganization?.id === org.id &&
								!isActiveOrganizationRefetching
									? "shadow-md ring-2 ring-primary"
									: "hover:shadow-md"
							}`}
						>
							<CardHeader className="pb-4">
								<div className="flex items-start justify-between">
									<div className="flex items-start space-x-3">
										<Avatar className="h-10 w-10">
											<AvatarImage src={org.logo || ""} alt={org.name} />
											<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
												{org.name[0]?.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0 flex-1">
											<CardTitle className="truncate font-semibold text-lg">
												{org.name}
											</CardTitle>
											<p className="text-muted-foreground text-sm">
												@{org.slug}
											</p>
										</div>
									</div>
									{activeOrganization?.id === org.id &&
										!isActiveOrganizationRefetching && (
											<Badge variant="default" className="font-medium text-xs">
												Active
											</Badge>
										)}
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								{org.metadata?.description && (
									<>
										<p className="line-clamp-2 text-muted-foreground text-sm">
											{org.metadata.description}
										</p>
										<Separator />
									</>
								)}
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-4 text-muted-foreground text-sm">
										<div className="flex items-center space-x-1">
											<Users className="h-4 w-4" />
											<span>0 members</span>
										</div>
										<div className="flex items-center space-x-1">
											<Calendar className="h-4 w-4" />
											<span>
												{new Date(org.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center space-x-2 pt-2">
									<Button
										variant="outline"
										size="sm"
										className="flex-1"
										onClick={() => {
											// Navigate to organization details
											console.log(`Navigate to organization ${org.id}`);
										}}
									>
										View Details
									</Button>
									{activeOrganization?.id !== org.id &&
										!isActiveOrganizationRefetching && (
											<Button size="sm" variant="default" className="flex-1">
												Switch To
											</Button>
										)}
								</div>
							</CardContent>
						</Card>
					))
				)}
			</div>

			{/* Pending Sent Invitations */}
			{sentInvitations.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Mail className="h-5 w-5" />
							<span>Pending Sent Invitations</span>
							<Badge variant="secondary">{sentInvitations.length}</Badge>
						</CardTitle>
						<CardDescription>
							Invitations you have sent that are still pending response.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{sentInvitations.map((invitation: any) => (
							<div
								key={invitation.id}
								className="flex items-center justify-between rounded-lg border p-4"
							>
								<div className="flex items-center space-x-4">
									<Avatar className="h-10 w-10">
										<AvatarImage
											src={invitation.organization?.logo || ""}
											alt={invitation.organization?.name || "Organization"}
										/>
										<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
											{invitation.organization?.name?.[0]?.toUpperCase() || "O"}
										</AvatarFallback>
									</Avatar>
									<div>
										<h4 className="font-semibold">{invitation.email}</h4>
										<p className="text-muted-foreground text-sm">
											Invited to:{" "}
											<span className="font-medium">
												{invitation.organization?.name ||
													"Unknown Organization"}
											</span>
										</p>
										<p className="text-muted-foreground text-sm">
											Role:{" "}
											<Badge variant="outline" className="capitalize">
												{invitation.role}
											</Badge>
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => handleCancelInvitation(invitation.id)}
										disabled={cancelInvitationMutation.isPending}
									>
										<X className="mr-1 h-4 w-4" />
										{cancelInvitationMutation.isPending
											? "Cancelling..."
											: "Cancel"}
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			)}

			<OrganizationMembers />
		</div>
	);
}
