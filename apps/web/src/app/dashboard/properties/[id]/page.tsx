"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	ArrowLeft,
	Building2,
	Edit,
	Eye,
	Home,
	MapPin,
	Ruler,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/utils/orpc";

export default function PropertyDetailPage() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const propertyId = params.id as string;

	const { data, isLoading } = useQuery(
		orpc.realEstate.property.getById.queryOptions({
			input: {
				id: propertyId,
			},
		}),
	);

	const deletePropertyMutation = useMutation(
		orpc.realEstate.property.delete.mutationOptions(),
	);

	const property = data?.data;

	const handleDelete = async () => {
		try {
			const result = await deletePropertyMutation.mutateAsync({
				id: propertyId,
			});

			if (result.success) {
				toast.success("Property deleted successfully");
				queryClient.invalidateQueries({
					queryKey: ["realEstate", "property", "getMyProperties"],
				});
				router.push("/dashboard/properties");
			} else {
				toast.error(result.error || "Failed to delete property");
			}
		} catch (error: unknown) {
			console.error("Failed to delete property:", error);
			const errorMessage =
				error instanceof Error ? error.message : "Failed to delete property";
			toast.error(errorMessage);
		}
	};

	if (isLoading) {
		return (
			<div className="container mx-auto max-w-6xl py-8">
				<Skeleton className="mb-4 h-8 w-64" />
				<Skeleton className="h-96 w-full" />
			</div>
		);
	}

	if (!property) {
		return (
			<div className="container mx-auto max-w-6xl py-8">
				<div className="text-center">
					<h2 className="mb-4 font-bold text-2xl">Property not found</h2>
					<Button asChild>
						<Link href="/dashboard/properties">Back to Properties</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto max-w-6xl py-8">
			<div className="mb-8">
				<Button variant="ghost" asChild className="mb-4">
					<Link href="/dashboard/properties">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Properties
					</Link>
				</Button>

				<div className="flex items-start justify-between">
					<div>
						<div className="mb-2 flex items-center gap-3">
							<h1 className="font-bold text-3xl tracking-tight">
								{property.title}
							</h1>
							<Badge variant={property.isActive ? "default" : "secondary"}>
								{property.isActive ? "Active" : "Inactive"}
							</Badge>
							<Badge variant="outline">
								{property.listingType === "rent"
									? "For Rent"
									: property.listingType === "buy"
										? "For Sale"
										: "Tracking"}
							</Badge>
						</div>
						<div className="flex items-center gap-4 text-muted-foreground">
							<span className="flex items-center gap-1">
								<MapPin className="h-4 w-4" />
								{property.area}, {property.city}
							</span>
							<span className="flex items-center gap-1">
								<Eye className="h-4 w-4" />
								{property.views} views
							</span>
						</div>
					</div>
					<div className="flex gap-2">
						<Button asChild>
							<Link href={`/dashboard/properties/${propertyId}/edit`}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</Link>
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive">
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										the property from your account.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction onClick={handleDelete}>
										Delete
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="space-y-6 lg:col-span-2">
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="text-3xl">
										{property.currency}{" "}
										{Number(property.price).toLocaleString()}
									</CardTitle>
									{property.rentFrequency && (
										<CardDescription>
											per {property.rentFrequency}
										</CardDescription>
									)}
								</div>
							</div>
						</CardHeader>
					</Card>

					{Array.isArray(property.images) && property.images.length > 0 && (
						<Card>
							<CardContent className="p-0">
								<div className="relative aspect-video bg-muted">
									<div className="relative h-full w-full">
										<Image
											src={property.images[0] as string}
											alt={property.title}
											className="h-full w-full rounded-lg object-cover"
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					)}

					<Card>
						<CardHeader>
							<CardTitle>Description</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="whitespace-pre-wrap text-muted-foreground">
								{property.description || "No description provided"}
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Property Details</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid gap-4 sm:grid-cols-2">
								<div className="flex items-center gap-2">
									<Home className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-muted-foreground text-sm">
											Property Type
										</p>
										<p className="font-medium capitalize">
											{property.propertyType.replace(/_/g, " ")}
										</p>
									</div>
								</div>
								{property.bedrooms !== null && (
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Bedrooms</p>
											<p className="font-medium">{property.bedrooms}</p>
										</div>
									</div>
								)}
								{property.bathrooms !== null && (
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Bathrooms</p>
											<p className="font-medium">{property.bathrooms}</p>
										</div>
									</div>
								)}
								{property.size !== null && (
									<div className="flex items-center gap-2">
										<Ruler className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Size</p>
											<p className="font-medium">{property.size} m²</p>
										</div>
									</div>
								)}
								{property.floor !== null && (
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">Floor</p>
											<p className="font-medium">{property.floor}</p>
										</div>
									</div>
								)}
								{property.parkingSpaces !== null && (
									<div className="flex items-center gap-2">
										<Building2 className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-muted-foreground text-sm">
												Parking Spaces
											</p>
											<p className="font-medium">{property.parkingSpaces}</p>
										</div>
									</div>
								)}
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-muted-foreground text-sm">Furnishing</p>
										<p className="font-medium capitalize">
											{property.furnishing?.replace(/_/g, " ")}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Building2 className="h-5 w-5 text-muted-foreground" />
									<div>
										<p className="text-muted-foreground text-sm">Status</p>
										<p className="font-medium capitalize">
											{property.propertyStatus.replace(/_/g, " ")}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Location</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-muted-foreground text-sm">Country</p>
								<p className="font-medium">{property.country}</p>
							</div>
							<Separator />
							<div>
								<p className="text-muted-foreground text-sm">City</p>
								<p className="font-medium">{property.city}</p>
							</div>
							<Separator />
							<div>
								<p className="text-muted-foreground text-sm">Area</p>
								<p className="font-medium">{property.area}</p>
							</div>
							{property.subArea && (
								<>
									<Separator />
									<div>
										<p className="text-muted-foreground text-sm">Sub Area</p>
										<p className="font-medium">{property.subArea}</p>
									</div>
								</>
							)}
							{property.streetAddress && (
								<>
									<Separator />
									<div>
										<p className="text-muted-foreground text-sm">
											Street Address
										</p>
										<p className="font-medium">{property.streetAddress}</p>
									</div>
								</>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Property Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div>
								<p className="text-muted-foreground text-sm">Created</p>
								<p className="font-medium">
									{new Date(property.createdAt).toLocaleDateString()}
								</p>
							</div>
							<Separator />
							<div>
								<p className="text-muted-foreground text-sm">Last Updated</p>
								<p className="font-medium">
									{new Date(property.updatedAt).toLocaleDateString()}
								</p>
							</div>
							<Separator />
							<div>
								<p className="text-muted-foreground text-sm">Views</p>
								<p className="font-medium">{property.views}</p>
							</div>
							<Separator />
							<div>
								<p className="text-muted-foreground text-sm">Inquiries</p>
								<p className="font-medium">{property.inquiries}</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
