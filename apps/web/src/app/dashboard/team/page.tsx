"use client";

import type { OrganizationRole } from "@estatemar/schemas/organizations";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Clock,
	Crown,
	Mail,
	Plus,
	Send,
	Shield,
	Trash2,
	UserCheck,
	UserX,
} from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useOrganization } from "@/contexts/organization-context";
import { orpc } from "@/utils/orpc";

export default function TeamPage() {
	const { currentOrg } = useOrganization();
	const emailInputId = useId();
	const [inviteForm, setInviteForm] = useState({
		email: "",
		role: "member" as Exclude<OrganizationRole, "owner">,
	});

	const canInvite =
		currentOrg?.memberRole === "owner" || currentOrg?.memberRole === "admin";
	const isOwner = currentOrg?.memberRole === "owner";

	// Fetch team members
	const {
		data: membersResponse,
		isLoading: membersLoading,
		refetch: refetchMembers,
	} = useQuery({
		...orpc.organizations.getOrganizationMembers.queryOptions({
			input: { organizationId: currentOrg?.id || "", limit: 50, offset: 0 },
		}),
		enabled: !!currentOrg?.id,
		staleTime: 2 * 60 * 1000,
	});

	const members = membersResponse?.success ? membersResponse.data : [];

	// Fetch organization invitations
	const {
		data: invitationsResponse,
		isLoading: invitationsLoading,
		refetch: refetchInvitations,
	} = useQuery({
		...orpc.organizations.getOrganizationInvitations.queryOptions({
			input: { organizationId: currentOrg?.id || "", limit: 50, offset: 0 },
		}),
		enabled: !!currentOrg?.id && canInvite,
		staleTime: 2 * 60 * 1000,
	});

	const invitations = invitationsResponse?.success
		? invitationsResponse.data
		: [];

	// Invite mutation
	const inviteMutation = useMutation({
		...orpc.organizations.inviteMember.mutationOptions(),
	});

	// Remove member mutation
	const removeMemberMutation = useMutation({
		...orpc.organizations.removeMember.mutationOptions(),
	});

	// Delete invitation mutation
	const deleteInvitationMutation = useMutation({
		...orpc.organizations.deleteInvitation.mutationOptions(),
	});

	const handleInvite = (e: React.FormEvent) => {
		e.preventDefault();
		if (!currentOrg?.id) return;

		inviteMutation.mutate(
			{
				organizationId: currentOrg.id,
				email: inviteForm.email,
				role: inviteForm.role,
			},
			{
				onSuccess: () => {
					toast.success("Invitation sent successfully!");
					setInviteForm({ email: "", role: "member" });
					refetchInvitations();
				},
				onError: (error) => {
					toast.error(error.message || "Failed to send invitation");
				},
			},
		);
	};

	const handleRemoveMember = (userId: string, userName: string) => {
		if (!currentOrg?.id) return;

		removeMemberMutation.mutate(
			{
				organizationId: currentOrg.id,
				userId,
			},
			{
				onSuccess: () => {
					toast.success(`${userName} has been removed from the team`);
					refetchMembers();
				},
				onError: (error) => {
					toast.error(error.message || "Failed to remove member");
				},
			},
		);
	};

	const handleDeleteInvitation = (invitationId: string, email: string) => {
		deleteInvitationMutation.mutate(
			{
				invitationId,
			},
			{
				onSuccess: () => {
					toast.success(`Invitation to ${email} has been cancelled`);
					refetchInvitations();
				},
				onError: (error) => {
					toast.error(error.message || "Failed to cancel invitation");
				},
			},
		);
	};

	const getRoleIcon = (role: string) => {
		switch (role) {
			case "owner":
				return <Crown className="h-4 w-4 text-yellow-500" />;
			case "admin":
				return <Shield className="h-4 w-4 text-blue-500" />;
			default:
				return <UserCheck className="h-4 w-4 text-gray-500" />;
		}
	};

	const getRoleBadgeVariant = (role: string) => {
		switch (role) {
			case "owner":
				return "default" as const;
			case "admin":
				return "secondary" as const;
			default:
				return "outline" as const;
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	if (!currentOrg) {
		return (
			<div className="flex h-64 items-center justify-center">
				<p className="text-muted-foreground">No organization selected</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-semibold text-2xl">Team Management</h1>
				<p className="text-muted-foreground">
					Manage members and permissions for {currentOrg.name}
				</p>
			</div>

			{/* Invite Form */}
			{canInvite && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Mail className="h-5 w-5" />
							Invite Team Members
						</CardTitle>
						<CardDescription>
							Send invitations to new team members via email
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleInvite} className="flex items-end gap-4">
							<div className="flex-1 space-y-2">
								<Label htmlFor={emailInputId}>Email Address</Label>
								<Input
									id={emailInputId}
									type="email"
									placeholder="colleague@example.com"
									value={inviteForm.email}
									onChange={(e) =>
										setInviteForm({ ...inviteForm, email: e.target.value })
									}
									required
								/>
							</div>
							<div className="w-40 space-y-2">
								<Label htmlFor="role">Role</Label>
								<Select
									value={inviteForm.role}
									onValueChange={(value) =>
										setInviteForm({
											...inviteForm,
											role: value as Exclude<OrganizationRole, "owner">,
										})
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="member">Member</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
										<SelectItem value="viewer">Viewer</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<Button type="submit" disabled={inviteMutation.isPending}>
								<Plus className="mr-2 h-4 w-4" />
								{inviteMutation.isPending ? "Sending..." : "Invite"}
							</Button>
						</form>
					</CardContent>
				</Card>
			)}

			{/* Team Members */}
			<Card>
				<CardHeader>
					<CardTitle>Team Members ({members?.length || 0})</CardTitle>
					<CardDescription>
						Current members of {currentOrg.name}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{membersLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }, (_, i) => (
								<div key={`member-skeleton-${Date.now()}-${Math.random()}`} className="flex items-center space-x-4">
									<div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
									<div className="flex-1 space-y-2">
										<div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
										<div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
									</div>
								</div>
							))}
						</div>
					) : members && members.length > 0 ? (
						<div className="space-y-4">
							{members.map((member) => (
								<div
									key={member.id}
									className="flex items-center justify-between rounded-lg border p-4"
								>
									<div className="flex items-center space-x-4">
										<Avatar>
											{member.user?.image ? (
												<AvatarImage
													src={member.user.image}
													alt={member.user.name}
												/>
											) : (
												<AvatarFallback>
													{getInitials(member.user?.name || "Unknown")}
												</AvatarFallback>
											)}
										</Avatar>
										<div>
											<div className="flex items-center gap-2">
												<span className="font-medium">
													{member.user?.name || "Unknown User"}
												</span>
												{getRoleIcon(member.role)}
											</div>
											<p className="text-muted-foreground text-sm">
												{member.user?.email}
											</p>
											<p className="text-muted-foreground text-xs">
												Joined {new Date(member.joinedAt).toLocaleDateString()}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant={getRoleBadgeVariant(member.role)}>
											{member.role}
										</Badge>
										{isOwner && member.role !== "owner" && (
											<AlertDialog>
												<AlertDialogTrigger asChild>
													<Button variant="outline" size="sm">
														<UserX className="h-4 w-4" />
													</Button>
												</AlertDialogTrigger>
												<AlertDialogContent>
													<AlertDialogHeader>
														<AlertDialogTitle>
															Remove Team Member
														</AlertDialogTitle>
														<AlertDialogDescription>
															Are you sure you want to remove{" "}
															{member.user?.name} from the team? This action
															cannot be undone.
														</AlertDialogDescription>
													</AlertDialogHeader>
													<AlertDialogFooter>
														<AlertDialogCancel>Cancel</AlertDialogCancel>
														<AlertDialogAction
															className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
															onClick={() =>
																handleRemoveMember(
																	member.userId,
																	member.user?.name || "Unknown User",
																)
															}
															disabled={removeMemberMutation.isPending}
														>
															{removeMemberMutation.isPending
																? "Removing..."
																: "Remove"}
														</AlertDialogAction>
													</AlertDialogFooter>
												</AlertDialogContent>
											</AlertDialog>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-8 text-center">
							<UserX className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
							<h3 className="mb-2 font-semibold">No team members</h3>
							<p className="text-muted-foreground">
								Start by inviting team members to collaborate.
							</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Pending Invitations */}
			{canInvite && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Send className="h-5 w-5" />
							Pending Invitations
						</CardTitle>
						<CardDescription>
							Invitations that have been sent but not yet accepted
						</CardDescription>
					</CardHeader>
					<CardContent>
						{invitationsLoading ? (
							<div className="space-y-3">
								{Array.from({ length: 2 }, (_, i) => (
									<div key={`invitation-skeleton-${Date.now()}-${Math.random()}`} className="flex items-center space-x-4">
										<div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
										<div className="flex-1 space-y-2">
											<div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
											<div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
										</div>
									</div>
								))}
							</div>
						) : invitations && invitations.length > 0 ? (
							<div className="space-y-4">
								{invitations
									.filter((invitation) => !invitation.acceptedAt)
									.map((invitation) => (
										<div
											key={invitation.id}
											className="flex items-center justify-between rounded-lg border p-4"
										>
											<div className="flex items-center space-x-4">
												<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
													<Clock className="h-6 w-6 text-orange-600" />
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span className="font-medium">
															{invitation.email}
														</span>
														<Badge variant="secondary">{invitation.role}</Badge>
													</div>
													<p className="text-muted-foreground text-sm">
														Invited{" "}
														{new Date(
															invitation.createdAt,
														).toLocaleDateString()}
													</p>
													<p className="text-muted-foreground text-xs">
														Expires{" "}
														{new Date(
															invitation.expiresAt,
														).toLocaleDateString()}
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-orange-600">
													<Clock className="mr-1 h-3 w-3" />
													Pending
												</Badge>
												{isOwner && (
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button variant="outline" size="sm">
																<Trash2 className="h-4 w-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	Cancel Invitation
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Are you sure you want to cancel the invitation
																	to {invitation.email}? This action cannot be
																	undone.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancel</AlertDialogCancel>
																<AlertDialogAction
																	className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
																	onClick={() =>
																		handleDeleteInvitation(
																			invitation.id,
																			invitation.email,
																		)
																	}
																	disabled={deleteInvitationMutation.isPending}
																>
																	{deleteInvitationMutation.isPending
																		? "Cancelling..."
																		: "Cancel Invitation"}
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												)}
											</div>
										</div>
									))}
							</div>
						) : (
							<div className="py-8 text-center">
								<Send className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
								<h3 className="mb-2 font-semibold">No pending invitations</h3>
								<p className="text-muted-foreground">
									All sent invitations have been accepted or expired.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
