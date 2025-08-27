"use client";

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
import { orpc } from "@/utils/orpc";

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

// Mock property data for editing
const mockProperty = {
	id: "1",
	name: "Luxury Villa with Ocean View",
	price: 2500000,
	location: "123 Ocean Drive, Miami Beach, FL 33139",
	status: "For Sale",
	type: "villa",
	bedrooms: 5,
	bathrooms: 4,
	area: 3500,
	lotSize: 8000,
	yearBuilt: 2018,
	parking: 3,
	description:
		"This stunning oceanfront villa offers unparalleled luxury and breathtaking panoramic views of the Atlantic Ocean. Featuring 5 spacious bedrooms, 4 full bathrooms, and an open-concept design that seamlessly blends indoor and outdoor living.",
	amenities: [
		"Ocean View",
		"Private Pool",
		"Gym/Fitness Center",
		"Garden/Landscaping",
		"Security System",
		"High-Speed Internet",
		"Garage Parking",
		"Air Conditioning",
	],
	images: [
		"/property-1-1.jpg",
		"/property-1-2.jpg",
		"/property-1-3.jpg",
		"/property-1-4.jpg",
	],
};

export default function EditPropertyPage() {
	const router = useRouter();
	const params = useParams();
	const propertyId = params.id as string;
	const { data: session, isPending } = authClient.useSession();
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
	const [existingImages, setExistingImages] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	// Load existing property data
	useEffect(() => {
		if (mockProperty) {
			setFormData({
				name: mockProperty.name,
				price: mockProperty.price.toString(),
				description: mockProperty.description,
				location: mockProperty.location,
				type: mockProperty.type,
				bedrooms: mockProperty.bedrooms.toString(),
				bathrooms: mockProperty.bathrooms.toString(),
				area: mockProperty.area.toString(),
				lotSize: mockProperty.lotSize.toString(),
				yearBuilt: mockProperty.yearBuilt.toString(),
				parking: mockProperty.parking.toString(),
				status: mockProperty.status,
			});
			setSelectedAmenities(mockProperty.amenities);
			setExistingImages(mockProperty.images);
		}
	}, []);

	if (!session || isPending) {
		return <div>Loading...</div>;
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
		setExistingImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Here you would normally submit to your API
		console.log("Updated Property Data:", {
			...formData,
			amenities: selectedAmenities,
			existingImages,
			newImages: images.map((img) => img.name),
		});

		setIsSubmitting(false);
		router.push(`/dashboard/properties/${propertyId}`);
	};

	return (
		<div className="mx-auto max-w-4xl space-y-6 p-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Edit Property</h1>
					<p className="text-muted-foreground">
						Update your property listing details
					</p>
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
									{existingImages.map((image) => (
										<div key={image} className="relative">
											<div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
												<span className="text-muted-foreground text-sm">
													Current Image
												</span>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="-top-2 -right-2 absolute h-6 w-6 p-0"
												onClick={() =>
													removeExistingImage(existingImages.indexOf(image))
												}
											>
												<IconX className="h-4 w-4" />
											</Button>
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
									{images.map((image) => (
										<div key={image.name} className="relative">
											<div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
												<span className="text-muted-foreground text-sm">
													{image.name}
												</span>
											</div>
											<Button
												type="button"
												variant="destructive"
												size="sm"
												className="-top-2 -right-2 absolute h-6 w-6 p-0"
												onClick={() => removeImage(images.indexOf(image))}
											>
												<IconX className="h-4 w-4" />
											</Button>
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
