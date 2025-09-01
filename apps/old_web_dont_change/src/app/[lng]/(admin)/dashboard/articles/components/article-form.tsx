"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
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
import type { ArticleWithImage } from "@/utils/content/articles";

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	content: z.string().min(1, "Content is required"),
	excerpt: z.string().min(1, "Excerpt is required"),
	author: z.string().min(1, "Author is required"),
	language: z.string().min(1, "Language is required"),
	slug: z.string().min(1, "Slug is required"),
	image_id: z.number().nullable(),
	is_published: z.boolean().default(false),
});

interface ArticleFormProps {
	article?: ArticleWithImage;
	onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
	lng: string;
}

export function ArticleForm({ article, onSubmit, lng }: ArticleFormProps) {
	const [image, setImage] = useState<DBFile | null>(article?.image || null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: article?.article || {
			title: "",
			content: "",
			excerpt: "",
			author: "",
			language: "",
			slug: "",
			is_published: false,
			image_id: null,
		},
		mode: "onChange",
	});

	const {
		formState: { errors, isValid },
	} = form;

	const getMissingFieldsMessage = () => {
		const missingFields = [];
		if (!image) missingFields.push("Featured Image");
		if (errors.title) missingFields.push("Title");
		if (errors.content) missingFields.push("Content");
		if (errors.excerpt) missingFields.push("Excerpt");
		if (errors.author) missingFields.push("Author");
		if (errors.language) missingFields.push("Language");
		if (errors.slug) missingFields.push("Slug");

		if (missingFields.length === 0) return "";
		return `Missing required fields: ${missingFields.join(", ")}`;
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="max-w-2xl space-y-6"
			>
				<div className="space-y-4">
					<h2 className="font-semibold text-lg">Article Information</h2>

					<div className="space-y-2">
						<FormLabel>Featured Image</FormLabel>
						<FileUpload
							onUploadComplete={(file) => {
								setImage(file);
								form.setValue("image_id", file.id);
							}}
							accept="image/*"
							maxSize={5242880} // 5MB
						/>
						{image && (
							<div className="mt-2">
								<Image
									src={image.url}
									width={image.width || 100}
									height={image.height || 100}
									alt="Featured Image"
									className="h-auto w-full object-contain"
								/>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="language"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Language</FormLabel>
									<FormControl>
										<select {...field} className="w-full rounded-md border p-2">
											<option value="">Select Language</option>
											<option value="en">English</option>
											<option value="ar">Arabic</option>
											<option value="he">Hebrew</option>
										</select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="excerpt"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Excerpt</FormLabel>
								<FormControl>
									<Textarea {...field} rows={3} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="content"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Content</FormLabel>
								<FormControl>
									<Textarea {...field} rows={10} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<FormField
							control={form.control}
							name="author"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Author</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="is_published"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
								<FormControl>
									<input
										type="checkbox"
										checked={field.value}
										onChange={field.onChange}
										className="mt-1 h-4 w-4"
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>Published</FormLabel>
									<p className="text-muted-foreground text-sm">
										This article will be visible to the public when published
									</p>
								</div>
							</FormItem>
						)}
					/>
				</div>

				<div className="flex flex-col gap-4">
					{getMissingFieldsMessage() && (
						<p className="text-red-500 text-sm">{getMissingFieldsMessage()}</p>
					)}

					<div className="flex justify-end gap-2">
						<Link href={`/${lng}/dashboard/articles`}>
							<Button type="button" variant="outline">
								Cancel
							</Button>
						</Link>
						<Button
							type="submit"
							disabled={!isValid || !image}
							title={getMissingFieldsMessage() || "Submit form"}
						>
							{article ? "Update Article" : "Create Article"}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
