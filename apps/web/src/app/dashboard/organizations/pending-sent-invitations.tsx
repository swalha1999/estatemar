"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import type React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";
import { SentInvitationItem } from "./sent-invitation-item";

export function PendingSentInvitations(): React.JSX.Element {
	// const { data: session } = authClient.useSession();
	// const { data: invitations = [], refetch: refetchInvitations } = useQuery(
	// 	orpc.auth.organization.getUserInvitations.queryOptions(),
	// );

	// const cancelInvitationMutation = useMutation(
	// 	orpc.auth.organization.cancelInvitation.mutationOptions({
	// 		onSuccess: () => {
	// 			toast.success("Invitation cancelled successfully!");
	// 			queryClient.invalidateQueries({
	// 				queryKey: orpc.auth.organization.key(),
	// 			});
	// 			refetchInvitations();
	// 		},
	// 		onError: (error) => {
	// 			toast.error(error.message || "Failed to cancel invitation");
	// 		},
	// 	}),
	// );

	// // Filter invitations sent by current user
	// const sentInvitations = Array.isArray(invitations)
	// 	? invitations.filter(
	// 			(invitation) =>
	// 				invitation.inviterId === session?.user?.id &&
	// 				invitation.status === "pending",
	// 		)
	// 	: [];

	// const handleCancelInvitation = (invitationId: string) => {
	// 	cancelInvitationMutation.mutate({ invitationId });
	// };

	// // Don't render if no sent invitations
	// if (sentInvitations.length === 0) {
	// 	return <></>;
	// }

	// return (
	// 	<Card>
	// 		<CardHeader>
	// 			<CardTitle className="flex items-center space-x-2">
	// 				<Mail className="h-5 w-5" />
	// 				<span>Pending Sent Invitations</span>
	// 				<Badge variant="secondary">{sentInvitations.length}</Badge>
	// 			</CardTitle>
	// 			<CardDescription>
	// 				Invitations you have sent that are still pending response.
	// 			</CardDescription>
	// 		</CardHeader>
	// 		<CardContent className="space-y-4">
	// 			{sentInvitations.map((invitation) => (
	// 				<SentInvitationItem
	// 					key={invitation.id}
	// 					invitation={invitation}
	// 					onCancel={handleCancelInvitation}
	// 					isLoading={cancelInvitationMutation.isPending}
	// 				/>
	// 			))}
	// 		</CardContent>
	// 	</Card>
	// );

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Mail className="h-5 w-5" />
					<span>Pending Sent Invitations</span>
					<Badge variant="secondary">{0}</Badge>
				</CardTitle>
				<CardDescription>
					Invitations you have sent that are still pending response.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">Not implemented yet.</CardContent>
		</Card>
	);
}
