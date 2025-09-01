"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { File as DBFile } from "@/db/schema";
import type { DeveloperWithLogo } from "@/utils/listings/developer";
import { addDeveloper, editDeveloper } from "../actions";

const developerSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	phone: z.string().optional().nullable(),
	whatsapp: z.string().optional().nullable(),
	email: z.string().email("Invalid email address").optional().nullable(),
	website: z.string().url("Invalid website URL").optional().nullable(),
	facebook: z.string().url("Invalid Facebook URL").optional().nullable(),
	instagram: z.string().url("Invalid Instagram URL").optional().nullable(),
	linkedin: z.string().url("Invalid LinkedIn URL").optional().nullable(),
	twitter: z.string().url("Invalid Twitter URL").optional().nullable(),
	logo_id: z.number().optional().nullable(),
});

interface DeveloperFormProps {
	developer?: DeveloperWithLogo;
	lng: string;
}

export function DeveloperForm({ developer, lng }: DeveloperFormProps) {
	const router = useRouter();
	const [image, setImage] = useState<DBFile | null>(developer?.logo || null);

	const form = useForm<z.infer<typeof developerSchema>>({
		resolver: zodResolver(developerSchema),
		defaultValues: {
			name: developer?.name || "",
			description: developer?.description || "",
			phone: developer?.phone || "",
			whatsapp: developer?.whatsapp || "",
			email: developer?.email || "",
			website: developer?.website || "",
			facebook: developer?.facebook || "",
			instagram: developer?.instagram || "",
			linkedin: developer?.linkedin || "",
			twitter: developer?.twitter || "",
		},
	});

	const onSubmit = async (values: z.infer<typeof developerSchema>) => {
		try {
			const result = developer
				? await editDeveloper({
						...values,
						id: developer.id,
						logo_id: image?.id,
					})
				: await addDeveloper({ ...values, logo_id: image?.id });

			if (result.success) {
				router.push(`/${lng}/dashboard/developers`);
				router.refresh();
			} else {
				console.error("Failed to save developer:", result.error);
			}
		} catch (error) {
			console.error("Failed to save developer:", error);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="max-w-2xl space-y-6"
			>
				<div className="space-y-4">
					<h2 className="font-semibold text-lg">Basic Information</h2>

					<div className="space-y-2">
						<FormLabel>Company Logo</FormLabel>
						<FileUpload
							onUploadComplete={(file) => {
								setImage(file as DBFile);
								form.setValue("logo_id", file.id);
							}}
							accept="image/*"
							maxSize={5242880} // 5MB
						/>
						{image && (
							<div className="mt-2">
								<Image
									width={image?.width || 100}
									height={image?.height || 100}
									src={image.url}
									alt="Company Logo"
									className="h-32 w-32 object-contain"
								/>
								<div className="text-gray-500 text-sm">
									{image.created_at.toLocaleString()}
								</div>
							</div>
						)}
					</div>

					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Company Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-4">
					<h2 className="font-semibold text-lg">Contact Information</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input {...field} type="tel" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="whatsapp"
							render={({ field }) => (
								<FormItem>
									<FormLabel>WhatsApp</FormLabel>
									<FormControl>
										<Input {...field} type="tel" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email Address</FormLabel>
								<FormControl>
									<Input {...field} type="email" value={field.value || ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="website"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Website</FormLabel>
								<FormControl>
									<Input {...field} type="url" value={field.value || ""} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-4">
					<h2 className="font-semibold text-lg">Social Media</h2>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="facebook"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Facebook</FormLabel>
									<FormControl>
										<Input {...field} type="url" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="instagram"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Instagram</FormLabel>
									<FormControl>
										<Input {...field} type="url" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="linkedin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>LinkedIn</FormLabel>
									<FormControl>
										<Input {...field} type="url" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="twitter"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Twitter</FormLabel>
									<FormControl>
										<Input {...field} type="url" value={field.value || ""} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<Link href={`/${lng}/dashboard/developers`}>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button type="submit">
						{developer ? "Save Changes" : "Add Developer"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
