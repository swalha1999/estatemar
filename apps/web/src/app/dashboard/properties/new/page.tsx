"use client";

import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/utils/orpc";

export default function NewPropertyPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const createPropertyMutation = useMutation(
		orpc.realEstate.property.create.mutationOptions(),
	);

	const form = useForm({
		defaultValues: {
			title: "",
			description: "",
			propertyType: "apartment" as const,
			listingType: "rent" as const,
			propertyStatus: "ready" as const,
			country: "",
			city: "",
			area: "",
			subArea: "",
			streetAddress: "",
			bedrooms: 0,
			bathrooms: 0,
			size: 0,
			floor: 0,
			parkingSpaces: 0,
			furnishing: "unfurnished" as const,
			price: "",
			currency: "AED",
			rentFrequency: "yearly",
			images: [] as string[],
		},
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				const result = await createPropertyMutation.mutateAsync({
					...value,
					bedrooms: value.bedrooms || null,
					bathrooms: value.bathrooms || null,
					size: value.size || null,
					floor: value.floor || null,
					parkingSpaces: value.parkingSpaces || 0,
				});

				if (result.success) {
					toast.success("Property created successfully!");
					router.push("/dashboard/properties");
				} else {
					toast.error(result.error || "Failed to create property");
				}
			} catch (error: unknown) {
				console.error("Failed to create property:", error);
				const errorMessage =
					error instanceof Error ? error.message : "Failed to create property";
				toast.error(errorMessage);
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	return (
		<div className="container mx-auto max-w-4xl py-8">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/dashboard/properties">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Properties
					</Link>
				</Button>
				<div className="flex items-center gap-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<Building2 className="h-6 w-6 text-primary" />
					</div>
					<div>
						<h1 className="font-bold text-3xl tracking-tight">
							Add New Property
						</h1>
						<p className="text-muted-foreground">
							Create a new property listing
						</p>
					</div>
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-8"
			>
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
						<CardDescription>
							Enter the basic details of your property
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<form.Field name="title">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>
										Property Title <span className="text-destructive">*</span>
									</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Luxury 2BR Apartment in Downtown"
										required
									/>
								</div>
							)}
						</form.Field>

						<form.Field name="description">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Description</Label>
									<Textarea
										id={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Describe your property..."
										rows={5}
									/>
								</div>
							)}
						</form.Field>

						<div className="grid gap-6 md:grid-cols-3">
							<form.Field name="propertyType">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Property Type <span className="text-destructive">*</span>
										</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value as typeof field.state.value)
											}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="apartment">Apartment</SelectItem>
												<SelectItem value="villa">Villa</SelectItem>
												<SelectItem value="house">House</SelectItem>
												<SelectItem value="townhouse">Townhouse</SelectItem>
												<SelectItem value="penthouse">Penthouse</SelectItem>
												<SelectItem value="studio">Studio</SelectItem>
												<SelectItem value="duplex">Duplex</SelectItem>
												<SelectItem value="compound">Compound</SelectItem>
												<SelectItem value="office">Office</SelectItem>
												<SelectItem value="retail">Retail</SelectItem>
												<SelectItem value="warehouse">Warehouse</SelectItem>
												<SelectItem value="land">Land</SelectItem>
												<SelectItem value="commercial">Commercial</SelectItem>
												<SelectItem value="industrial">Industrial</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>

							<form.Field name="listingType">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Listing Type <span className="text-destructive">*</span>
										</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value as typeof field.state.value)
											}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="rent">For Rent</SelectItem>
												<SelectItem value="buy">For Sale</SelectItem>
												<SelectItem value="track">Track Only</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>

							<form.Field name="propertyStatus">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Status <span className="text-destructive">*</span>
										</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value as typeof field.state.value)
											}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="under_construction">
													Under Construction
												</SelectItem>
												<SelectItem value="ready">Ready</SelectItem>
												<SelectItem value="off_plan">Off Plan</SelectItem>
												<SelectItem value="resale">Resale</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Location</CardTitle>
						<CardDescription>Where is your property located?</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-2">
							<form.Field name="country">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Country <span className="text-destructive">*</span>
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="United Arab Emirates"
											required
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="city">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											City <span className="text-destructive">*</span>
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Dubai"
											required
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="area">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Area <span className="text-destructive">*</span>
										</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Downtown"
											required
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="subArea">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Sub Area</Label>
										<Input
											id={field.name}
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Business Bay"
										/>
									</div>
								)}
							</form.Field>
						</div>

						<form.Field name="streetAddress">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>Street Address</Label>
									<Input
										id={field.name}
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="123 Main Street"
									/>
								</div>
							)}
						</form.Field>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Property Details</CardTitle>
						<CardDescription>
							Specifications and features of your property
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-3">
							<form.Field name="bedrooms">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Bedrooms</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number.parseInt(e.target.value) || 0)
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="bathrooms">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Bathrooms</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number.parseInt(e.target.value) || 0)
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="size">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Size (m²)</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(
													Number.parseFloat(e.target.value) || 0,
												)
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="floor">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Floor</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number.parseInt(e.target.value) || 0)
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="parkingSpaces">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Parking Spaces</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											value={field.state.value}
											onChange={(e) =>
												field.handleChange(Number.parseInt(e.target.value) || 0)
											}
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="furnishing">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Furnishing</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) =>
												field.handleChange(value as typeof field.state.value)
											}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="unfurnished">Unfurnished</SelectItem>
												<SelectItem value="semi_furnished">
													Semi Furnished
												</SelectItem>
												<SelectItem value="fully_furnished">
													Fully Furnished
												</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pricing</CardTitle>
						<CardDescription>Set the price for your property</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-6 md:grid-cols-3">
							<form.Field name="price">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Price <span className="text-destructive">*</span>
										</Label>
										<Input
											id={field.name}
											type="number"
											min="0"
											step="0.01"
											value={field.state.value}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="100000"
											required
										/>
									</div>
								)}
							</form.Field>

							<form.Field name="currency">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>
											Currency <span className="text-destructive">*</span>
										</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) => field.handleChange(value)}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="AED">AED</SelectItem>
												<SelectItem value="USD">USD</SelectItem>
												<SelectItem value="EUR">EUR</SelectItem>
												<SelectItem value="GBP">GBP</SelectItem>
												<SelectItem value="SAR">SAR</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>

							<form.Field name="rentFrequency">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Rent Frequency</Label>
										<Select
											value={field.state.value}
											onValueChange={(value) => field.handleChange(value)}
										>
											<SelectTrigger id={field.name}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="monthly">Monthly</SelectItem>
												<SelectItem value="yearly">Yearly</SelectItem>
												<SelectItem value="weekly">Weekly</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							</form.Field>
						</div>
					</CardContent>
				</Card>

				<div className="flex gap-4">
					<Button
						type="button"
						variant="outline"
						className="flex-1"
						onClick={() => router.back()}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button type="submit" className="flex-1" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Creating...
							</>
						) : (
							"Create Property"
						)}
					</Button>
				</div>
			</form>
		</div>
	);
}
