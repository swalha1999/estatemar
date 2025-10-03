"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
	Crown,
	Mail,
	MoreHorizontal,
	Shield,
	User,
	UserPlus,
} from "lucide-react";
import { useState } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export function OrganizationMembers() {
	const [isInviting, setIsInviting] = useState(false);
	const [inviteOpen, setInviteOpen] = useState(false);
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("member");
	const { data: activeOrganization } = authClient.useActiveOrganization();

	const inviteMemberMutator = useMutation(
		orpc.auth.organization.inviteMember.mutationOptions(),
	);

	// Get members for the active organization
	const {
		data: members,
		isPending,
		refetch,
	} = useQuery(
		orpc.auth.organization.getActiveOrganizationMembers.queryOptions(),
	);

	const handleInviteMember = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email.trim() || !activeOrganization) return;

		setIsInviting(true);
		try {
			inviteMemberMutator.mutate({
				email: email.trim(),
				role: role as "member" | "owner" | "admin",
				organizationId: activeOrganization.id,
			});
			setEmail("");
			setRole("member");
			setInviteOpen(false);
			refetch();
			toast.success("Invitation sent successfully!");
		} catch (error: any) {
			console.error("Failed to invite member:", error);
			toast.error(error.message || "Failed to send invitation");
		} finally {
			setIsInviting(false);
		}
	};

	if (!activeOrganization) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Organization Members</CardTitle>
					<CardDescription>
						Select an organization to view members.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
				<div>
					<CardTitle>Organization Members</CardTitle>
					<CardDescription>
						Manage members for {activeOrganization.name}
					</CardDescription>
				</div>
				<Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
					<DialogTrigger asChild>
						<Button>
							<UserPlus className="mr-2 h-4 w-4" />
							Invite Member
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Invite Member</DialogTitle>
							<DialogDescription>
								Send an invitation to join {activeOrganization.name}.
							</DialogDescription>
						</DialogHeader>
						<form onSubmit={handleInviteMember} className="space-y-4">
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="member@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<div>
								<Label htmlFor="role">Role</Label>
								<Select value={role} onValueChange={setRole}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="member">Member</SelectItem>
										<SelectItem value="admin">Admin</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex justify-end space-x-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => setInviteOpen(false)}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isInviting}>
									{isInviting ? "Inviting..." : "Send Invitation"}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</CardHeader>
			<CardContent className="p-0">
				{isPending ? (
					<div className="p-6">
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="flex items-center space-x-4">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-[200px]" />
										<Skeleton className="h-3 w-[150px]" />
									</div>
									<div className="ml-auto">
										<Skeleton className="h-6 w-[80px]" />
									</div>
								</div>
							))}
						</div>
					</div>
				) : members?.members.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12">
						<User className="mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">No members yet</h3>
						<p className="mb-4 text-center text-muted-foreground text-sm">
							Invite team members to start collaborating on projects together.
						</p>
						<Button onClick={() => setInviteOpen(true)}>
							<UserPlus className="mr-2 h-4 w-4" />
							Invite Your First Member
						</Button>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Member</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead className="w-[70px]" />
							</TableRow>
						</TableHeader>
						<TableBody>
							{members?.members.map((member: any) => (
								<TableRow key={member.id}>
									<TableCell>
										<div className="flex items-center space-x-3">
											<Avatar className="h-8 w-8">
												<AvatarImage
													src={member.user?.image}
													alt={member.user?.name || member.user?.email}
												/>
												<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-sm text-white">
													{member.user?.name?.[0]?.toUpperCase() ||
														member.user?.email?.[0]?.toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div className="min-w-0 flex-1">
												<p className="truncate font-medium">
													{member.user?.name || "Unknown User"}
												</p>
												<p className="truncate text-muted-foreground text-sm">
													{member.user?.email}
												</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center space-x-2">
											{member.role === "owner" && (
												<Crown className="h-4 w-4 text-yellow-500" />
											)}
											{member.role === "admin" && (
												<Shield className="h-4 w-4 text-blue-500" />
											)}
											{member.role === "member" && (
												<User className="h-4 w-4 text-gray-500" />
											)}
											<Badge
												variant={
													member.role === "owner"
														? "default"
														: member.role === "admin"
															? "secondary"
															: "outline"
												}
												className="capitalize"
											>
												{member.role}
											</Badge>
										</div>
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{member.createdAt
											? new Date(member.createdAt).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})
											: "N/A"}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0"
												>
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Open menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem>
													<Mail className="mr-2 h-4 w-4" />
													Send Message
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem className="text-red-600">
													Remove Member
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</CardContent>
		</Card>
	);
}
