"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FileUpload } from "@/components/file-upload";
import { Icon } from "@/components/icon";
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
import {
	type Amenity,
	type File as DBFile,
	type Developer,
	Project,
} from "@/db/schema";
import { cn } from "@/lib/utils";
import type { CreateProjectData } from "@/utils/listings/project";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().min(1, "Description is required"),
	country: z.string().min(1, "Country is required"),
	city: z.string().min(1, "City is required"),
	latitude: z.string().nullable(),
	longitude: z.string().nullable(),
	date_of_completion: z.string().nullable(),
	min_price: z.string().min(1, "Min Price is required"),
	max_price: z.string().min(1, "Max Price is required"),
	show_price: z.boolean().default(false),
	total_units: z.number().min(1, "Total Units is required"),
	available_units: z.number().min(0, "Available Units is required"),
	is_best_seller: z.boolean().default(false),
	is_recommended: z.boolean().default(false),
	developer_id: z.number({
		required_error: "Please select a developer",
	}),
	amenity_ids: z.array(z.number()),
	created_at: z.date().default(() => new Date()),
	images: z.array(z.custom<DBFile>()),
	files: z.array(z.custom<DBFile>()),
});
type FormSchema = z.infer<typeof formSchema>;

interface ProjectFormProps {
	developers: Developer[];
	amenities: Amenity[];
	onSubmit: (data: CreateProjectData) => Promise<void>;
	lng: string;
	initialData?: CreateProjectData;
}

export function ProjectForm({
	developers,
	amenities,
	onSubmit,
	lng,
	initialData,
}: ProjectFormProps) {
	const [images, setImages] = useState<DBFile[]>(initialData?.images || []);
	const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
		initialData?.amenity_ids || [],
	);

	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: initialData?.name || "",
			slug: initialData?.slug || "",
			description: initialData?.description || "",
			country: initialData?.country || "",
			city: initialData?.city || "",
			latitude: initialData?.latitude || null,
			longitude: initialData?.longitude || null,
			date_of_completion: initialData?.date_of_completion
				? new Date(initialData.date_of_completion).toISOString().split("T")[0]
				: null,
			max_price: initialData?.max_price || "",
			min_price: initialData?.min_price || "",
			show_price: initialData?.show_price || false,
			total_units: initialData?.total_units || 0,
			available_units: initialData?.available_units || 0,
			is_best_seller: initialData?.is_best_seller || false,
			is_recommended: initialData?.is_recommended || false,
			developer_id:
				initialData?.developer_id || (undefined as unknown as number),
			amenity_ids: initialData?.amenity_ids || [],
			created_at: initialData?.created_at || new Date(),
			images: initialData?.images || [],
			files: initialData?.files || [],
		},
	});

	const handleSubmit = async (data: FormSchema) => {
		await onSubmit({
			...data,
			latitude: data.latitude,
			longitude: data.longitude,
			created_at: new Date(),
			images: images,
			files: [],
			date_of_completion: data.date_of_completion
				? new Date(data.date_of_completion)
				: null,
			amenity_ids: selectedAmenities,
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="max-w-2xl space-y-6"
			>
				<div className="space-y-4">
					<h2 className="font-semibold text-lg">Project Information</h2>

					<div className="space-y-2">
						<FormLabel>Project Images</FormLabel>
						<FileUpload
							onUploadComplete={(file) => {
								setImages((prev) => [...prev, file]);
							}}
							accept="image/*"
							maxSize={5242880}
						/>
						{images.length > 0 && (
							<div className="mt-2 grid grid-cols-3 gap-4">
								{images.map((image) => (
									<div key={image.id} className="group relative">
										<Image
											src={image.url}
											width={200}
											height={200}
											alt="Project Image"
											className="h-auto w-full rounded object-cover"
										/>
										<div className="absolute top-2 left-2 flex gap-2">
											<span className="rounded-md bg-black/50 px-2 py-1 text-white text-xs">
												[DIMENSIONS] {image.width}x{image.height}
											</span>
										</div>

										<div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
											<Button
												type="button"
												variant="destructive"
												size="sm"
												onClick={() =>
													setImages(images.filter((img) => img.id !== image.id))
												}
											>
												Remove
											</Button>
											<Button
												type="button"
												variant="secondary"
												size="sm"
												onClick={async () => {
													try {
														const response = await fetch(image.url);
														const blob = await response.blob();
														const url = window.URL.createObjectURL(blob);
														const link = document.createElement("a");
														link.href = url;
														link.download = `project-image-${image.id}${image.url.substring(image.url.lastIndexOf("."))}`;
														document.body.appendChild(link);
														link.click();
														document.body.removeChild(link);
														window.URL.revokeObjectURL(url);
													} catch (error) {
														console.error("Error downloading image:", error);
													}
												}}
											>
												Download
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
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
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea {...field} rows={5} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="min_price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Min Price</FormLabel>
									<FormControl>
										<Input {...field} type="number" step="any" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="max_price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Max Price</FormLabel>
									<FormControl>
										<Input {...field} type="number" step="any" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="show_price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Show Price</FormLabel>
									<FormControl>
										<input
											type="checkbox"
											checked={field.value}
											onChange={field.onChange}
											className="mt-1 h-4 w-4"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="total_units"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total Units</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="available_units"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Available Units</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="latitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Latitude</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											step="any"
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value || null)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="longitude"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Longitude</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="number"
											step="any"
											value={field.value || ""}
											onChange={(e) => field.onChange(e.target.value || null)}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="date_of_completion"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Completion Date</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="date"
										value={field.value || ""}
										onChange={(e) => field.onChange(e.target.value || null)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							control={form.control}
							name="is_best_seller"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Best Seller</FormLabel>
									<FormControl>
										<input
											type="checkbox"
											checked={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="is_recommended"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Recommended</FormLabel>
									<FormControl>
										<input
											type="checkbox"
											checked={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="developer_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Developer</FormLabel>
								<FormControl>
									<select
										{...field}
										className="w-full rounded-md border p-2"
										onChange={(e) => field.onChange(Number(e.target.value))}
									>
										<option value="">Select Developer</option>
										{developers.map((developer) => (
											<option key={developer.id} value={developer.id}>
												{developer.name}
											</option>
										))}
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="amenity_ids"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Amenities</FormLabel>
								<FormControl>
									<div className="grid grid-cols-3 gap-2">
										{amenities?.map((amenity) => (
											<Button
												key={amenity.id}
												type="button"
												variant={
													selectedAmenities?.includes(amenity.id)
														? "default"
														: "outline"
												}
												className={cn(
													"flex items-center gap-2",
													selectedAmenities?.includes(amenity.id) &&
														"ring-2 ring-primary",
												)}
												onClick={() => {
													const isSelected = selectedAmenities.includes(
														amenity.id,
													);
													const newSelection = isSelected
														? selectedAmenities.filter(
																(id) => id !== amenity.id,
															)
														: [...selectedAmenities, amenity.id];

													setSelectedAmenities(newSelection);
													field.onChange(newSelection);
												}}
											>
												<Icon name={amenity.icon} size={16} />
												<span>{amenity.name}</span>
												{selectedAmenities?.includes(amenity.id) && (
													<Icon name="Check" className="ml-auto h-4 w-4" />
												)}
											</Button>
										))}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-2">
					<Link href={`/${lng}/dashboard/projects`}>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button type="submit">
						{initialData ? "Update Project" : "Create Project"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
