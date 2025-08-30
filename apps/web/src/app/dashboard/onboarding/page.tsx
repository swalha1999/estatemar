"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Building, Check, Mail, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { toast } from "sonner";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useOrganization } from "@/contexts/organization-context";
import { orpc } from "@/utils/orpc";

export default function OnboardingPage() {
	const router = useRouter();
	const { refetchOrgs } = useOrganization();
	const nameInputId = useId();
	const slugInputId = useId();
	const descriptionInputId = useId();
	const [showCreateForm, setShowCreateForm] = useState(false);

	const [createForm, setCreateForm] = useState({
		name: "",
		slug: "",
		description: "",
	});

	// Fetch user invitations
	const {
		data: invitationsResponse,
		isLoading: invitationsLoading,
		refetch: refetchInvitations,
	} = useQuery({
		...orpc.organizations.getUserInvitations.queryOptions({
			input: { limit: 10, offset: 0 },
		}),
		staleTime: 30 * 1000, // 30 seconds
	});

	const invitations = invitationsResponse?.success
		? invitationsResponse.data
		: [];

	const mutation = useMutation({
		...orpc.organizations.createOrganization.mutationOptions(),
	});

	const acceptInviteMutation = useMutation({
		...orpc.organizations.acceptInvitation.mutationOptions(),
	});

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "")
			.replace(/\s+/g, "-")
			.replace(/-+/g, "-")
			.trim();
	};

	const handleNameChange = (name: string) => {
		setCreateForm((prev) => ({
			...prev,
			name,
			slug: generateSlug(name),
		}));
	};

	const handleCreateOrganization = async (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(
			{
				name: createForm.name,
				slug: createForm.slug,
				description: createForm.description || undefined,
			},
			{
				onSuccess: async () => {
					toast.success("Organization created successfully!");
					await refetchOrgs();
					router.push("/dashboard");
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	};

	const handleAcceptInvitation = (token: string, orgName: string) => {
		acceptInviteMutation.mutate(
			{ token },
			{
				onSuccess: async () => {
					toast.success(`Successfully joined ${orgName}!`);
					await refetchOrgs();
					await refetchInvitations();
					router.push("/dashboard");
				},
				onError: (error) => {
					toast.error(error.message || "Failed to accept invitation");
				},
			},
		);
	};

	return (
		<div className="container mx-auto flex h-screen items-center justify-center px-4">
			<Card className="w-full max-w-2xl">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Welcome to Estatemar!</CardTitle>
					<CardDescription>
						Get started by joining an existing organization or creating a new
						one.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Invitations Section */}
					{invitationsLoading ? (
						<div className="space-y-3">
							<div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
							<div className="space-y-2">
								<div className="h-16 animate-pulse rounded bg-gray-200" />
								<div className="h-16 animate-pulse rounded bg-gray-200" />
							</div>
						</div>
					) : invitations && invitations.length > 0 ? (
						<div className="space-y-4">
							<div className="flex items-center gap-2">
								<Mail className="h-5 w-5 text-blue-500" />
								<h3 className="font-semibold">Pending Invitations</h3>
							</div>
							<div className="space-y-3">
								{invitations.map((invitation) => (
									<div
										key={invitation.id}
										className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4"
									>
										<div className="flex-1">
											<div className="flex items-center gap-2">
												<h4 className="font-medium">
													{invitation.organization.name}
												</h4>
												<Badge variant="secondary">{invitation.role}</Badge>
											</div>
											<p className="text-muted-foreground text-sm">
												{invitation.organization.description ||
													"No description"}
											</p>
											<p className="text-muted-foreground text-xs">
												Invited on{" "}
												{new Date(invitation.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() =>
													handleAcceptInvitation(
														invitation.token,
														invitation.organization.name,
													)
												}
												disabled={acceptInviteMutation.isPending}
											>
												<Check className="mr-1 h-4 w-4" />
												Accept
											</Button>
											<Button size="sm" variant="outline">
												<X className="mr-1 h-4 w-4" />
												Decline
											</Button>
										</div>
									</div>
								))}
							</div>
							<Separator />
						</div>
					) : null}

					{/* Create Organization Section */}
					{!showCreateForm ? (
						<div className="space-y-4 text-center">
							<div>
								<Building className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
								<h3 className="mb-2 font-semibold text-lg">
									Create Your Organization
								</h3>
								<p className="mb-4 text-muted-foreground">
									Start fresh by creating a new organization for your team.
								</p>
							</div>
							<Button
								onClick={() => setShowCreateForm(true)}
								className="w-full"
							>
								<Plus className="mr-2 h-4 w-4" />
								Create New Organization
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Create Organization</h3>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowCreateForm(false)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
							<form onSubmit={handleCreateOrganization} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor={nameInputId}>Organization Name</Label>
									<Input
										id={nameInputId}
										placeholder="e.g., Your Company Name"
										value={createForm.name}
										onChange={(e) => handleNameChange(e.target.value)}
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor={slugInputId}>Organization URL</Label>
									<div className="flex items-center space-x-2">
										<span className="text-muted-foreground text-sm">
											estatemar.com/
										</span>
										<Input
											id={slugInputId}
											placeholder="your-organization"
											value={createForm.slug}
											onChange={(e) =>
												setCreateForm((prev) => ({
													...prev,
													slug: e.target.value,
												}))
											}
											required
											pattern="^[a-z0-9-]+$"
											title="Only lowercase letters, numbers, and hyphens are allowed"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor={descriptionInputId}>
										Description (Optional)
									</Label>
									<Textarea
										id={descriptionInputId}
										placeholder="Tell us about your organization..."
										value={createForm.description}
										onChange={(e) =>
											setCreateForm((prev) => ({
												...prev,
												description: e.target.value,
											}))
										}
									/>
								</div>

								<Button
									type="submit"
									className="w-full"
									disabled={mutation.isPending}
								>
									<Building className="mr-2 h-4 w-4" />
									{mutation.isPending ? "Creating..." : "Create Organization"}
								</Button>
							</form>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
