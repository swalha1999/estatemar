"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
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

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const firstNameId = useId();
	const lastNameId = useId();
	const emailId = useId();
	const phoneId = useId();
	const companyId = useId();
	const licenseId = useId();
	const emailPropertyId = useId();
	const emailPriceId = useId();
	const emailInquiryId = useId();
	const smsUrgentId = useId();
	const smsInquiryId = useId();

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (!session || isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Profile</h1>
					<p className="text-muted-foreground">
						Manage your account information and preferences
					</p>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				{/* Profile Overview */}
				<Card className="md:col-span-1">
					<CardHeader className="text-center">
						<Avatar className="mx-auto h-24 w-24">
							<AvatarImage src="/avatars/user.jpg" alt="Profile" />
							<AvatarFallback className="text-lg">
								{session.user?.name?.charAt(0) || "U"}
							</AvatarFallback>
						</Avatar>
						<CardTitle>{session.user?.name || "User"}</CardTitle>
						<CardDescription>{session.user?.email}</CardDescription>
						<Badge variant="secondary">Verified</Badge>
					</CardHeader>
					<CardContent>
						<Button variant="outline" className="w-full">
							Change Avatar
						</Button>
					</CardContent>
				</Card>

				{/* Profile Details */}
				<Card className="md:col-span-2">
					<CardHeader>
						<CardTitle>Personal Information</CardTitle>
						<CardDescription>Update your personal details here</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={firstNameId}>First Name</Label>
								<Input
									id={firstNameId}
									defaultValue={session.user?.name?.split(" ")[0] || ""}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={lastNameId}>Last Name</Label>
								<Input
									id={lastNameId}
									defaultValue={session.user?.name?.split(" ")[1] || ""}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<Label htmlFor={emailId}>Email</Label>
							<Input
								id={emailId}
								type="email"
								defaultValue={session.user?.email || ""}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor={phoneId}>Phone Number</Label>
							<Input id={phoneId} type="tel" placeholder="+1 (555) 123-4567" />
						</div>
						<div className="space-y-2">
							<Label htmlFor={companyId}>Company</Label>
							<Input id={companyId} placeholder="Real Estate Company Name" />
						</div>
						<div className="space-y-2">
							<Label htmlFor={licenseId}>License Number</Label>
							<Input id={licenseId} placeholder="Real Estate License #" />
						</div>
					</CardContent>
				</Card>

				{/* Contact Preferences */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Contact Preferences</CardTitle>
						<CardDescription>
							Manage how you receive notifications and communications
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="space-y-4">
								<h4 className="font-medium">Email Notifications</h4>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<input
											type="checkbox"
											id={emailPropertyId}
											defaultChecked
										/>
										<Label htmlFor={emailPropertyId}>New property alerts</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" id={emailPriceId} defaultChecked />
										<Label htmlFor={emailPriceId}>
											Price change notifications
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" id={emailInquiryId} defaultChecked />
										<Label htmlFor={emailInquiryId}>Property inquiries</Label>
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<h4 className="font-medium">SMS Notifications</h4>
								<div className="space-y-2">
									<div className="flex items-center space-x-2">
										<input type="checkbox" id={smsUrgentId} />
										<Label htmlFor={smsUrgentId}>Urgent updates only</Label>
									</div>
									<div className="flex items-center space-x-2">
										<input type="checkbox" id={smsInquiryId} />
										<Label htmlFor={smsInquiryId}>New inquiries</Label>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Account Statistics */}
				<Card className="md:col-span-3">
					<CardHeader>
						<CardTitle>Account Statistics</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							<div className="rounded-lg bg-muted p-4 text-center">
								<div className="font-bold text-2xl text-primary">12</div>
								<div className="text-muted-foreground text-sm">
									Properties Listed
								</div>
							</div>
							<div className="rounded-lg bg-muted p-4 text-center">
								<div className="font-bold text-2xl text-primary">8</div>
								<div className="text-muted-foreground text-sm">
									Properties Sold
								</div>
							</div>
							<div className="rounded-lg bg-muted p-4 text-center">
								<div className="font-bold text-2xl text-primary">45</div>
								<div className="text-muted-foreground text-sm">
									Total Inquiries
								</div>
							</div>
							<div className="rounded-lg bg-muted p-4 text-center">
								<div className="font-bold text-2xl text-primary">4.8</div>
								<div className="text-muted-foreground text-sm">
									Average Rating
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex justify-end space-x-4">
				<Button variant="outline">Cancel</Button>
				<Button>Save Changes</Button>
			</div>
		</div>
	);
}
