"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import {
	ArrowLeft,
	Building2,
	CheckCircle,
	Loader2,
	Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactElement, useId, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

// Schema for form validation
// const createOrgSchema = z.object({
// 	name: z.string().min(1, "Name is required"),
// 	slug: z.string().min(1, "Slug is required"),
// 	logo: z.string().nullable().optional(),
// 	metadata: z.any().optional(),
// });

export default function CreateOrganizationPage(): ReactElement {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const createOrganizationMutation = useMutation(
		orpc.auth.organization.createOrganization.mutationOptions(),
	);
	const nameId = useId();
	const slugId = useId();
	const logoId = useId();
	const descriptionId = useId();

	const form = useForm({
		defaultValues: {
			name: "",
			slug: "",
			logo: "",
			metadata: "",
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				const result = await createOrganizationMutation.mutateAsync({
					name: value.name,
					slug: value.slug,
					logo: value.logo || "",
					metadata: value.metadata,
				});

				if (result) {
					toast.success("Organization created successfully!");
					router.push("/dashboard/organizations");
				}
			} catch (error: unknown) {
				console.error("Failed to create organization:", error);
				const errorMessage =
					error instanceof Error
						? error.message
						: "Failed to create organization";
				toast.error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	const generateSlug = (name: string) => {
		return name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)+/g, "");
	};

	return (
		<div className="container mx-auto py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<Link
						href="/dashboard/organizations"
						className="mb-4 inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Organizations
					</Link>
					<div className="flex items-center space-x-3">
						<div className="rounded-lg bg-primary/10 p-2">
							<Building2 className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="font-bold text-3xl">Create Organization</h1>
							<p className="text-muted-foreground">
								Set up a new organization to manage your team and projects.
							</p>
						</div>
					</div>
				</div>

				<Card className="overflow-hidden">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
							<div className="flex items-center space-x-3">
								<Avatar className="h-10 w-10">
									<AvatarImage
										src={form.getFieldValue("logo")}
										alt="Organization logo preview"
									/>
									<AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-medium text-white">
										{form.getFieldValue("name")?.[0]?.toUpperCase() || "O"}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>Organization Details</CardTitle>
									<CardDescription>
										Provide basic information about your organization.
									</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-6 p-6">
							<form.Field name="name">
								{(field) => (
									<div className="space-y-2">
										<Label
											htmlFor={nameId}
											className="flex items-center space-x-2"
										>
											<span>Organization Name *</span>
											{field.state.value && (
												<CheckCircle className="h-4 w-4 text-green-500" />
											)}
										</Label>
										<Input
											id={nameId}
											placeholder="Enter organization name"
											value={field.state.value}
											onChange={(e) => {
												const name = e.target.value;
												field.handleChange(name);
												// Auto-generate slug from name
												if (name) {
													form.setFieldValue("slug", generateSlug(name));
												}
											}}
											disabled={isSubmitting}
											className={
												field.state.value
													? "border-green-300 focus:border-green-500"
													: ""
											}
										/>
										<p className="text-muted-foreground text-sm">
											Choose a descriptive name for your organization.
										</p>
									</div>
								)}
							</form.Field>

							<form.Field name="slug">
								{(field) => (
									<div className="space-y-2">
										<Label
											htmlFor={slugId}
											className="flex items-center space-x-2"
										>
											<span>Organization Slug *</span>
											{field.state.value && (
												<CheckCircle className="h-4 w-4 text-green-500" />
											)}
										</Label>
										<div className="relative">
											<Input
												id={slugId}
												placeholder="organization-slug"
												value={field.state.value}
												onChange={(e) => field.handleChange(e.target.value)}
												disabled={isSubmitting}
												className={
													field.state.value
														? "border-green-300 pl-20 focus:border-green-500"
														: "pl-20"
												}
											/>
											<div className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground text-sm">
												estatemar.com/
											</div>
										</div>
										<p className="text-muted-foreground text-sm">
											This will be used in URLs. Only lowercase letters,
											numbers, and hyphens are allowed.
										</p>
									</div>
								)}
							</form.Field>

							<Separator />

							<form.Field name="logo">
								{(field) => (
									<div className="space-y-2">
										<Label
											htmlFor={logoId}
											className="flex items-center space-x-2"
										>
											<Upload className="h-4 w-4" />
											<span>Logo URL (Optional)</span>
										</Label>
										<Input
											id={logoId}
											type="url"
											placeholder="https://example.com/logo.png"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={isSubmitting}
										/>
										<p className="text-muted-foreground text-sm">
											Add a logo to represent your organization. The preview
											will appear above.
										</p>
									</div>
								)}
							</form.Field>

							<form.Field name="metadata">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={descriptionId}>
											Description (Optional)
										</Label>
										<Textarea
											id={descriptionId}
											placeholder="Describe what your organization does..."
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											disabled={isSubmitting}
											rows={3}
										/>
										<p className="text-muted-foreground text-sm">
											Provide a brief description of your organization's purpose
											or activities.
										</p>
									</div>
								)}
							</form.Field>

							<Separator />

							<div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:border-blue-800 dark:from-blue-950/20 dark:to-indigo-950/20">
								<div className="flex items-start space-x-3">
									<div className="rounded-full bg-blue-500 p-2">
										<CheckCircle className="h-5 w-5 text-white" />
									</div>
									<div>
										<h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
											What happens next?
										</h3>
										<ul className="space-y-2 text-blue-700 text-sm dark:text-blue-300">
											<li className="flex items-center space-x-2">
												<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
												<span>You'll be set as the organization owner</span>
											</li>
											<li className="flex items-center space-x-2">
												<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
												<span>You can invite team members via email</span>
											</li>
											<li className="flex items-center space-x-2">
												<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
												<span>Manage roles and permissions for members</span>
											</li>
											<li className="flex items-center space-x-2">
												<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
												<span>Switch between organizations anytime</span>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.back()}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								{isSubmitting
									? "Creating Organization..."
									: "Create Organization"}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
