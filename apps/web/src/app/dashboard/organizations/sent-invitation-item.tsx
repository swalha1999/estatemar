"use client";

import { X } from "lucide-react";
import type React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SentInvitationItemProps {
	invitation: {
		id: string;
		email: string;
		role: string;
		organization?: {
			name?: string;
			logo?: string;
		};
	};
	onCancel: (invitationId: string) => void;
	isLoading?: boolean;
}

export function SentInvitationItem({
	invitation,
	onCancel,
	isLoading = false,
}: SentInvitationItemProps): React.JSX.Element {
	return (
		<div className="flex items-center justify-between rounded-lg border p-4">
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
							{invitation.organization?.name || "Unknown Organization"}
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
					onClick={() => onCancel(invitation.id)}
					disabled={isLoading}
				>
					<X className="mr-1 h-4 w-4" />
					{isLoading ? "Cancelling..." : "Cancel"}
				</Button>
			</div>
		</div>
	);
}
