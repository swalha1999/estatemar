"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Bell, Check } from "lucide-react";
import type React from "react";
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

export default function NotificationsPage(): React.JSX.Element {
	const { data: session } = authClient.useSession();
	const {
		data: invitations = [],
		isPending: isInvitationsLoading,
		refetch: refetchInvitations,
	} = useQuery(orpc.auth.organization.getUserInvitations.queryOptions());

	const acceptInvitationMutation = useMutation(
		orpc.auth.organization.acceptInvitation.mutationOptions({
			onSuccess: () => {
				toast.success("Invitation accepted successfully!");
				queryClient.invalidateQueries({
					queryKey: orpc.auth.organization.key(),
				});
				refetchInvitations();
			},
			onError: (error) => {
				toast.error(error.message || "Failed to accept invitation");
			},
		}),
	);

	// Filter invitations received by current user (not sent)
	const receivedInvitations = Array.isArray(invitations)
		? invitations.filter(
				(invitation) =>
					invitation.inviterId !== session?.user?.id &&
					invitation.status === "pending",
			)
		: [];

	const handleAcceptInvitation = (invitationId: string) => {
		acceptInvitationMutation.mutate({ invitationId });
	};

	if (isInvitationsLoading) {
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
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-8 py-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Notifications</h1>
					<p className="text-muted-foreground">
						View your organization invitations and updates.
					</p>
				</div>
			</div>

			{/* Organization Invitations */}
			{receivedInvitations.length > 0 ? (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center space-x-2">
							<Bell className="h-5 w-5" />
							<span>Organization Invitations</span>
							<Badge variant="secondary">{receivedInvitations.length}</Badge>
						</CardTitle>
						<CardDescription>
							You have been invited to join the following organizations.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{receivedInvitations.map((invitation) => (
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
										<h4 className="font-semibold">
											{invitation.organization?.name || "Unknown Organization"}
										</h4>
										<p className="text-muted-foreground text-sm">
											Role:{" "}
											<Badge variant="outline" className="capitalize">
												{invitation.role}
											</Badge>
										</p>
										<p className="text-muted-foreground text-xs">
											Invited by{" "}
											{invitation.inviter?.user.name ||
												invitation.inviter?.user.email ||
												"Unknown"}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-2">
									<Button
										onClick={() => handleAcceptInvitation(invitation.id)}
										disabled={acceptInvitationMutation.isPending}
									>
										<Check className="mr-1 h-4 w-4" />
										{acceptInvitationMutation.isPending
											? "Accepting..."
											: "Accept"}
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<Bell className="mb-4 h-16 w-16 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-xl">No new notifications</h3>
						<p className="max-w-md text-center text-muted-foreground">
							You're all caught up! Organization invitations and other
							notifications will appear here.
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
