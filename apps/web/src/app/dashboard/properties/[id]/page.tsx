"use client";

import {
	IconBarbell,
	IconBath,
	IconBed,
	IconCar,
	IconMapPin,
	IconRuler,
	IconShield,
	IconSwimming,
	IconTrees,
	IconWifi,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

const amenityIcons: {
	[key: string]: React.ComponentType<{ className?: string }>;
} = {
	"Ocean View": IconMapPin,
	"Private Pool": IconSwimming,
	"Gym/Fitness Center": IconBarbell,
	"Garden/Landscaping": IconTrees,
	"Security System": IconShield,
	"High-Speed Internet": IconWifi,
	"Garage Parking": IconCar,
};

export default function PropertyDetailsPage() {
	const router = useRouter();
	const params = useParams();
	const propertyId = params.id as string;
	const { data: session, isPending } = authClient.useSession();

	const { data: propertyData, isLoading } = useQuery(
		orpc.properties.getProperty.queryOptions({ input: { id: propertyId } }),
	);

	useQuery(orpc.auth.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (!session || isPending || isLoading) {
		return <div>Loading...</div>;
	}

	const property = propertyData?.success ? propertyData.data : null;

	if (!property) {
		return <div>Property not found</div>;
	}

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "For Sale":
				return "default";
			case "Sold":
				return "secondary";
			case "Pending":
				return "outline";
			default:
				return "default";
		}
	};

	return (
		<div className="mx-auto max-w-7xl space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<Link href="/dashboard/properties">
						<Button variant="outline">← Back to Properties</Button>
					</Link>
					<div>
						<h1 className="font-bold text-3xl">{property.name}</h1>
						<p className="flex items-center text-muted-foreground">
							<IconMapPin className="mr-1 h-4 w-4" />
							{property.location}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Badge variant={getStatusBadgeVariant(property.status)}>
						{property.status}
					</Badge>
					<Link href={`/dashboard/properties/${propertyId}/edit`}>
						<Button>Edit Property</Button>
					</Link>
				</div>
			</div>

			{/* Price and Key Info */}
			<Card>
				<CardContent className="pt-6">
					<div className="grid grid-cols-2 gap-4 md:grid-cols-6">
						<div className="col-span-2">
							<div className="font-bold text-3xl text-primary">
								${Number(property.price).toLocaleString()}
							</div>
							<p className="text-muted-foreground text-sm">Listed Price</p>
						</div>
						<div className="flex items-center space-x-2">
							<IconBed className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{property.bedrooms || 0}</div>
								<div className="text-muted-foreground text-sm">Bedrooms</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconBath className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{property.bathrooms || 0}</div>
								<div className="text-muted-foreground text-sm">Bathrooms</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconRuler className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">
									{property.area?.toLocaleString() || 0}
								</div>
								<div className="text-muted-foreground text-sm">Sq Ft</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconCar className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{property.parking || 0}</div>
								<div className="text-muted-foreground text-sm">Parking</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Image Gallery */}
			<Card>
				<CardHeader>
					<CardTitle>Property Images</CardTitle>
				</CardHeader>
				<CardContent>
					{property.images && property.images.length > 0 ? (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
							{property.images.map((image) => (
								<div
									key={image.id}
									className="group relative aspect-video overflow-hidden rounded-lg bg-muted"
								>
									<Image
										src={image.signedUrl}
										alt={property.name}
										fill
										className="object-cover transition-transform group-hover:scale-105"
									/>
								</div>
							))}
						</div>
					) : (
						<div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
							<span className="text-muted-foreground text-sm">
								No images available
							</span>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Detailed Information Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="amenities">Amenities</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{property.description}
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Property Details</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<div className="flex justify-between">
									<span className="text-muted-foreground">Property Type:</span>
									<span className="font-medium">{property.type}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Year Built:</span>
									<span className="font-medium">
										{property.yearBuilt || "N/A"}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Lot Size:</span>
									<span className="font-medium">
										{property.lotSize?.toLocaleString() || "N/A"} sq ft
									</span>
								</div>
								{property.area && (
									<div className="flex justify-between">
										<span className="text-muted-foreground">
											Price per Sq Ft:
										</span>
										<span className="font-medium">
											$
											{Math.round(
												Number(property.price) / property.area,
											).toLocaleString()}
										</span>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="amenities" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Available Amenities</CardTitle>
							<CardDescription>
								All the amenities and features included with this property
							</CardDescription>
						</CardHeader>
						<CardContent>
							{property.amenities && property.amenities.length > 0 ? (
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
									{property.amenities.map((amenity) => {
										const IconComponent = amenityIcons[amenity] || IconMapPin;
										return (
											<div
												key={amenity}
												className="flex items-center space-x-3 rounded-lg bg-muted p-3"
											>
												<IconComponent className="h-5 w-5 text-primary" />
												<span className="font-medium">{amenity}</span>
											</div>
										);
									})}
								</div>
							) : (
								<p className="text-muted-foreground">No amenities listed</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
