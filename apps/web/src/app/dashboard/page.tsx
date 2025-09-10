"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { Building2, Mail, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
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
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export default function Page(): React.JSX.Element {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const { data: organizations, isPending: isOrganizationsLoading } =
		authClient.useListOrganizations();
	const {
		data: invitations = [],
		isPending: isInvitationsLoading,
		refetch: refetchInvitations,
	} = useQuery(orpc.auth.organization.getInvitations.queryOptions());

	const acceptInvitationMutation = useMutation(
		orpc.auth.organization.acceptInvitation.mutationOptions({
			onSuccess: () => {
				toast.success("Invitation accepted successfully!");
				queryClient.invalidateQueries({
					queryKey: orpc.auth.organization.key(),
				});
				refetchInvitations();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to accept invitation");
			},
		}),
	);

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	const handleAcceptInvitation = (invitationId: string) => {
		acceptInvitationMutation.mutate({ invitationId });
	};

	if (isPending || isOrganizationsLoading || isInvitationsLoading) {
		return (
			<div className="container mx-auto space-y-8 py-8">
				<div className="flex items-center justify-between">
					<div>
						<Skeleton className="mb-2 h-8 w-48" />
						<Skeleton className="h-4 w-96" />
					</div>
				</div>
				<div className="space-y-4">
					<Skeleton className="h-48 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		);
	}

	const hasOrganizations = organizations && organizations.length > 0;
	const hasPendingInvitations =
		invitations && Array.isArray(invitations) && invitations.length > 0;

	return (
		<div className="container mx-auto space-y-8 py-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome to your dashboard. Manage your organizations and invitations
						here.
					</p>
				</div>
			</div>

			{/* Pending Invitations */}
			{hasPendingInvitations && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Mail className="h-5 w-5" />
							<span>Pending Invitations</span>
							<Badge variant="secondary">
								{Array.isArray(invitations) ? invitations.length : 0}
							</Badge>
						</CardTitle>
						<CardDescription>
							You have been invited to join the following organizations.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{Array.isArray(invitations) &&
							invitations.map((invitation: any) => (
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
												{invitation.organization?.name?.[0]?.toUpperCase() ||
													"O"}
											</AvatarFallback>
										</Avatar>
										<div>
											<h4 className="font-semibold">
												{invitation.organization?.name ||
													"Unknown Organization"}
											</h4>
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
											onClick={() => handleAcceptInvitation(invitation.id)}
											disabled={acceptInvitationMutation.isPending}
										>
											{acceptInvitationMutation.isPending
												? "Accepting..."
												: "Accept"}
										</Button>
									</div>
								</div>
							))}
						)
					</CardContent>
				</Card>
			)}

			{/* No Organizations State */}
			{!hasOrganizations && !hasPendingInvitations && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-xl">
							You are not part of any organization
						</h3>
						<p className="mb-6 max-w-md text-center text-muted-foreground">
							Create your first organization to get started with team
							collaboration, or wait for an invitation from an existing
							organization.
						</p>
						<Button asChild size="lg">
							<Link href="/dashboard/organizations/new">
								<Plus className="mr-2 h-4 w-4" />
								Create Organization
							</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{/* Organizations Overview */}
			{hasOrganizations && (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center justify-center py-8">
							<Building2 className="mb-4 h-8 w-8 text-muted-foreground" />
							<h4 className="mb-2 font-semibold">Organizations</h4>
							<p className="mb-4 text-center text-muted-foreground text-sm">
								You are part of {organizations.length} organization
								{organizations.length !== 1 ? "s" : ""}.
							</p>
							<Button asChild variant="outline">
								<Link href="/dashboard/organizations">
									<Users className="mr-2 h-4 w-4" />
									View All Organizations
								</Link>
							</Button>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
