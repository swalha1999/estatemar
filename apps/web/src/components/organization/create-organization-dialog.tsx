"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { orpc } from "@/utils/orpc";
import { useOrganization } from "@/contexts/organization-context";

const createOrgSchema = z.object({
	name: z.string().min(1, "Organization name is required").max(100),
	slug: z
		.string()
		.min(1, "Organization slug is required")
		.max(50)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

interface CreateOrganizationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateOrganizationDialog({
	open,
	onOpenChange,
}: CreateOrganizationDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const { refreshOrganizations } = useOrganization();

	const form = useForm<CreateOrgFormData>({
		resolver: zodResolver(createOrgSchema),
		defaultValues: {
			name: "",
			slug: "",
		},
	});

	// Auto-generate slug from name
	const handleNameChange = (name: string) => {
		const slug = name
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "")
			.slice(0, 50);
		form.setValue("slug", slug);
	};

	const onSubmit = async (data: CreateOrgFormData) => {
		try {
			setIsLoading(true);
			await orpc.organization.createOrganization.mutate(data);

			toast.success("Organization created successfully!");
			form.reset();
			onOpenChange(false);

			// Refresh organizations list
			await refreshOrganizations();
		} catch (error: any) {
			toast.error(error.message || "Failed to create organization");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create Organization</DialogTitle>
					<DialogDescription>
						Create a new organization to collaborate with your team.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Acme Inc"
											onChange={(e) => {
												field.onChange(e);
												handleNameChange(e.target.value);
											}}
										/>
									</FormControl>
									<FormDescription>
										The display name for your organization
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Organization Slug</FormLabel>
									<FormControl>
										<Input {...field} placeholder="acme-inc" />
									</FormControl>
									<FormDescription>
										A unique identifier for your organization URL
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Creating..." : "Create Organization"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
