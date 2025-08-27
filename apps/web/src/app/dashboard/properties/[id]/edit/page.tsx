"use client";

import type {
	PropertyStatus,
	PropertyType,
} from "@estatemar/schemas/properties";
import { IconUpload, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { authClient } from "@/lib/auth-client";
import { client, orpc } from "@/utils/orpc";

const amenitiesOptions = [
	"Ocean View",
	"Private Pool",
	"Gym/Fitness Center",
	"Garden/Landscaping",
	"Security System",
	"High-Speed Internet",
	"Garage Parking",
	"Air Conditioning",
	"Balcony/Patio",
	"Walk-in Closet",
	"Fireplace",
	"Hardwood Floors",
	"Updated Kitchen",
	"Laundry Room",
	"Storage Space",
	"Pet Friendly",
];

export default function EditPropertyPage() {
	const router = useRouter();
	const params = useParams();
	const { data: session, isPending } = authClient.useSession();

	// Ensure propertyId is a valid string
	let propertyId = Array.isArray(params.id) ? params.id[0] : params.id;

	// Decode URL-encoded property ID if necessary
	if (propertyId && typeof propertyId === "string") {
		propertyId = decodeURIComponent(propertyId.trim());
	}

	console.log("Edit page - params:", params);
	console.log("Edit page - propertyId:", propertyId);
	console.log("Edit page - session:", session);
	const nameId = useId();
	const priceId = useId();
	const typeId = useId();
	const locationId = useId();
	const descriptionId = useId();
	const bedroomsId = useId();
	const bathroomsId = useId();
	const areaId = useId();
	const lotSizeId = useId();
	const yearBuiltId = useId();
	const parkingId = useId();
	const statusId = useId();
	const imageUploadId = useId();

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		description: "",
		location: "",
		type: "",
		bedrooms: "",
		bathrooms: "",
		area: "",
		lotSize: "",
		yearBuilt: "",
		parking: "",
		status: "For Sale",
	});

	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
	const [images, setImages] = useState<File[]>([]);
	const [existingImages, setExistingImages] = useState<
		Array<{ id: string; signedUrl: string }>
	>([]);
	const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	console.log("Fetching property with ID:", propertyId);

	const {
		data: propertyData,
		isLoading: isPropertyLoading,
		error: propertyError,
	} = useQuery({
		...orpc.getProperty.queryOptions({ input: { id: propertyId || "" } }),
		enabled: !!propertyId && !!session && !isPending,
		retry: 1,
	});

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	// Load existing property data
	useEffect(() => {
		if (
			propertyData &&
			"success" in propertyData &&
			propertyData.success &&
			"data" in propertyData &&
			propertyData.data
		) {
			const property = propertyData.data;
			console.log("Loading property data:", property); // Debug log
			setFormData({
				name: property.name || "",
				price: property.price || "",
				description: property.description || "",
				location: property.location || "",
				type: property.type || "",
				bedrooms: property.bedrooms ? property.bedrooms.toString() : "",
				bathrooms: property.bathrooms || "",
				area: property.area ? property.area.toString() : "",
				lotSize: property.lotSize ? property.lotSize.toString() : "",
				yearBuilt: property.yearBuilt ? property.yearBuilt.toString() : "",
				parking: property.parking ? property.parking.toString() : "",
				status: property.status || "For Sale",
			});
			setSelectedAmenities(property.amenities || []);
			setExistingImages(
				property.images?.map((img: any) => ({
					id: img.id,
					signedUrl: img.signedUrl,
				})) || [],
			);
			console.log("Form data set:", {
				name: property.name || "",
				price: property.price || "",
				description: property.description || "",
				location: property.location || "",
				type: property.type || "",
				bedrooms: property.bedrooms ? property.bedrooms.toString() : "",
				bathrooms: property.bathrooms || "",
				area: property.area ? property.area.toString() : "",
				lotSize: property.lotSize ? property.lotSize.toString() : "",
				yearBuilt: property.yearBuilt ? property.yearBuilt.toString() : "",
				parking: property.parking ? property.parking.toString() : "",
				status: property.status || "For Sale",
			});
		}
	}, [propertyData]);

	// Early return validations
	if (!propertyId || typeof propertyId !== "string") {
		return <div>Error: Invalid property ID</div>;
	}

	if (!session || isPending || isPropertyLoading) {
		return <div>Loading...</div>;
	}

	if (propertyError) {
		console.error("Property error:", propertyError);
		return (
			<div className="p-6">
				<h1 className="mb-4 font-bold text-xl">Error loading property</h1>
				<div className="rounded border border-red-200 bg-red-50 p-4">
					<p className="text-red-800">{propertyError.message}</p>
					<p className="mt-2 text-red-600 text-sm">Property ID: {propertyId}</p>
				</div>
			</div>
		);
	}

	if (propertyData && "success" in propertyData && !propertyData.success) {
		return (
			<div>
				Error: {"error" in propertyData ? propertyData.error : "Unknown error"}
			</div>
		);
	}

	if (!propertyData || !("data" in propertyData) || !propertyData.data) {
		return <div>No property data found</div>;
	}

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleAmenityChange = (amenity: string, checked: boolean) => {
		setSelectedAmenities((prev) =>
			checked ? [...prev, amenity] : prev.filter((a) => a !== amenity),
		);
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);
		setImages((prev) => [...prev, ...files]);
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	const removeExistingImage = (index: number) => {
		const imageToRemove = existingImages[index];
		setImagesToRemove((prev) => [...prev, imageToRemove.id]);
		setExistingImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!propertyId) {
				throw new Error("Property ID is required");
			}

			// Update property details
			const updateResult = await client.updateProperty({
				id: propertyId,
				name: formData.name,
				description: formData.description,
				location: formData.location,
				price: Number.parseFloat(formData.price),
				type: formData.type as PropertyType,
				status: formData.status as PropertyStatus,
				bedrooms: formData.bedrooms
					? Number.parseInt(formData.bedrooms)
					: undefined,
				bathrooms: formData.bathrooms
					? Number.parseFloat(formData.bathrooms)
					: undefined,
				area: formData.area ? Number.parseInt(formData.area) : undefined,
				lotSize: formData.lotSize
					? Number.parseInt(formData.lotSize)
					: undefined,
				yearBuilt: formData.yearBuilt
					? Number.parseInt(formData.yearBuilt)
					: undefined,
				parking: formData.parking
					? Number.parseInt(formData.parking)
					: undefined,
			});

			if (!updateResult.success || !updateResult.data) {
				throw new Error(updateResult.error || "Failed to update property");
			}

			// Remove images that were marked for deletion
			for (const imageId of imagesToRemove) {
				await client.removePropertyImage({
					imageId,
				});
			}

			// Upload new images and associate them with the property
			for (let i = 0; i < images.length; i++) {
				const image = images[i];
				const uploadResult = await client.uploadFile({
					file: image,
					fileName: `properties/${propertyId}/${Date.now()}-${image.name}`,
				});

				if (uploadResult.success && uploadResult.data) {
					// Add the image to the property
					await client.addPropertyImage({
						propertyId,
						objectKey: uploadResult.data.objectKey,
						fileName: image.name,
						mimeType: image.type || "application/octet-stream",
						fileSize: image.size,
						isPrimary: i === 0 && existingImages.length === 0, // First new image is primary if no existing images
						sortOrder: existingImages.length + i,
					});
				}
			}

			// Update amenities (remove all existing and add new ones)
			// First, we would need to get existing amenities and remove them
			// For now, we'll just add the new ones (assuming the backend handles duplicates)

			router.push(`/dashboard/properties/${propertyId}`);
		} catch (error) {
			console.error("Error updating property:", error);
			// You might want to show an error toast here
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Edit Property</h1>
					<p className="text-muted-foreground">
						Update your property listing details
					</p>
					{/* Debug info */}
					<div className="mt-2 text-muted-foreground text-xs">
						Debug: name={formData.name}, price={formData.price}, type=
						{formData.type}
					</div>
				</div>
				<Link href={`/dashboard/properties/${propertyId}`}>
					<Button variant="outline">Cancel</Button>
				</Link>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
						<CardDescription>
							Update the fundamental details about your property
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={nameId}>Property/Project Name *</Label>
							<Input
								id={nameId}
								placeholder="e.g., Luxury Villa with Ocean View"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								required
							/>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor={priceId}>Price *</Label>
								<Input
									id={priceId}
									type="number"
									placeholder="2500000"
									value={formData.price}
									onChange={(e) => handleInputChange("price", e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={typeId}>Property Type *</Label>
								<Select
									key={`type-${formData.type}`}
									value={formData.type}
									onValueChange={(value) => handleInputChange("type", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select property type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="villa">Villa</SelectItem>
										<SelectItem value="apartment">Apartment</SelectItem>
										<SelectItem value="house">House</SelectItem>
										<SelectItem value="condo">Condo</SelectItem>
										<SelectItem value="townhouse">Townhouse</SelectItem>
										<SelectItem value="commercial">Commercial</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={locationId}>Location *</Label>
							<Input
								id={locationId}
								placeholder="123 Ocean Drive, Miami Beach, FL 33139"
								value={formData.location}
								onChange={(e) => handleInputChange("location", e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor={descriptionId}>Description *</Label>
							<Textarea
								id={descriptionId}
								placeholder="Describe your property in detail..."
								value={formData.description}
								onChange={(e) =>
									handleInputChange("description", e.target.value)
								}
								rows={4}
								required
							/>
						</div>
					</CardContent>
				</Card>

				{/* Property Details */}
				<Card>
					<CardHeader>
						<CardTitle>Property Details</CardTitle>
						<CardDescription>
							Update the technical details and specifications
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<Label htmlFor={bedroomsId}>Bedrooms</Label>
								<Input
									id={bedroomsId}
									type="number"
									placeholder="3"
									value={formData.bedrooms}
									onChange={(e) =>
										handleInputChange("bedrooms", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={bathroomsId}>Bathrooms</Label>
								<Input
									id={bathroomsId}
									type="number"
									step="0.5"
									placeholder="2.5"
									value={formData.bathrooms}
									onChange={(e) =>
										handleInputChange("bathrooms", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={areaId}>Area (sq ft)</Label>
								<Input
									id={areaId}
									type="number"
									placeholder="2500"
									value={formData.area}
									onChange={(e) => handleInputChange("area", e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={lotSizeId}>Lot Size (sq ft)</Label>
								<Input
									id={lotSizeId}
									type="number"
									placeholder="5000"
									value={formData.lotSize}
									onChange={(e) => handleInputChange("lotSize", e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={yearBuiltId}>Year Built</Label>
								<Input
									id={yearBuiltId}
									type="number"
									placeholder="2020"
									value={formData.yearBuilt}
									onChange={(e) =>
										handleInputChange("yearBuilt", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor={parkingId}>Parking Spaces</Label>
								<Input
									id={parkingId}
									type="number"
									placeholder="2"
									value={formData.parking}
									onChange={(e) => handleInputChange("parking", e.target.value)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor={statusId}>Listing Status</Label>
							<Select
								key={`status-${formData.status}`}
								value={formData.status}
								onValueChange={(value) => handleInputChange("status", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="For Sale">For Sale</SelectItem>
									<SelectItem value="For Rent">For Rent</SelectItem>
									<SelectItem value="Pending">Pending</SelectItem>
									<SelectItem value="Sold">Sold</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Images */}
				<Card>
					<CardHeader>
						<CardTitle>Property Images</CardTitle>
						<CardDescription>Update your property images</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Existing Images */}
						{existingImages.length > 0 && (
							<div>
								<h4 className="mb-2 font-medium">Current Images</h4>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
									{existingImages.map((image, index) => (
										<div key={image.id} className="group relative">
											<div className="aspect-video overflow-hidden rounded-lg bg-muted">
												<img
													src={image.signedUrl}
													alt={`Current image ${index + 1}`}
													className="h-full w-full object-cover transition-transform group-hover:scale-105"
												/>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="-top-2 -right-2 absolute h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => removeExistingImage(index)}
											>
												<IconX className="h-4 w-4" />
											</Button>
											<div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
												Image {index + 1}
											</div>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Upload New Images */}
						<div className="rounded-lg border-2 border-muted-foreground/25 border-dashed p-6 text-center">
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={handleImageUpload}
								className="hidden"
								id={imageUploadId}
							/>
							<label htmlFor={imageUploadId} className="cursor-pointer">
								<IconUpload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
								<p className="text-muted-foreground text-sm">
									Click to upload new images or drag and drop
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									PNG, JPG, WEBP up to 10MB each
								</p>
							</label>
						</div>

						{/* New Images */}
						{images.length > 0 && (
							<div>
								<h4 className="mb-2 font-medium">New Images</h4>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
									{images.map((image, index) => (
										<div key={image.name} className="group relative">
											<div className="aspect-video overflow-hidden rounded-lg bg-muted">
												<img
													src={URL.createObjectURL(image)}
													alt={image.name}
													className="h-full w-full object-cover transition-transform group-hover:scale-105"
												/>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="-top-2 -right-2 absolute h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
												onClick={() => removeImage(index)}
											>
												<IconX className="h-4 w-4" />
											</Button>
											<div className="absolute right-0 bottom-0 left-0 truncate bg-black/50 p-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
												{image.name}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Amenities */}
				<Card>
					<CardHeader>
						<CardTitle>Amenities</CardTitle>
						<CardDescription>
							Update amenities available with this property
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{amenitiesOptions.map((amenity) => (
								<div key={amenity} className="flex items-center space-x-2">
									<Checkbox
										id={amenity}
										checked={selectedAmenities.includes(amenity)}
										onCheckedChange={(checked) =>
											handleAmenityChange(amenity, !!checked)
										}
									/>
									<Label htmlFor={amenity} className="font-normal text-sm">
										{amenity}
									</Label>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Submit */}
				<div className="flex justify-end space-x-4">
					<Link href={`/dashboard/properties/${propertyId}`}>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</Link>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Updating Property..." : "Update Property"}
					</Button>
				</div>
			</form>
		</div>
	);
}
