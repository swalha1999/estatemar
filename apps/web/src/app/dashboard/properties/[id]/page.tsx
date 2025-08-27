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

// Mock property data
const mockProperty = {
	id: "1",
	name: "Luxury Villa with Ocean View",
	price: 2500000,
	location: "123 Ocean Drive, Miami Beach, FL 33139",
	status: "For Sale",
	type: "Villa",
	bedrooms: 5,
	bathrooms: 4,
	area: 3500,
	lotSize: 8000,
	yearBuilt: 2018,
	parking: 3,
	images: [
		"/property-1-1.jpg",
		"/property-1-2.jpg",
		"/property-1-3.jpg",
		"/property-1-4.jpg",
	],
	description:
		"This stunning oceanfront villa offers unparalleled luxury and breathtaking panoramic views of the Atlantic Ocean. Featuring 5 spacious bedrooms, 4 full bathrooms, and an open-concept design that seamlessly blends indoor and outdoor living. The property boasts high-end finishes throughout, including marble countertops, hardwood floors, and floor-to-ceiling windows that flood the space with natural light.",
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
	features: [
		"Open concept living",
		"Gourmet kitchen with premium appliances",
		"Master suite with walk-in closet",
		"Private balcony with ocean views",
		"Hardwood flooring throughout",
		"Smart home technology",
		"Energy efficient windows",
		"Custom built-ins",
	],
	priceHistory: [
		{ date: "2024-01-01", price: 2600000, event: "Listed" },
		{ date: "2024-02-15", price: 2550000, event: "Price Reduced" },
		{ date: "2024-03-01", price: 2500000, event: "Price Reduced" },
	],
	viewingStats: {
		totalViews: 1247,
		weeklyViews: 89,
		inquiries: 23,
		tours: 8,
	},
};

const amenityIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
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

	useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (!session || isPending) {
		return <div>Loading...</div>;
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
						<h1 className="font-bold text-3xl">{mockProperty.name}</h1>
						<p className="flex items-center text-muted-foreground">
							<IconMapPin className="mr-1 h-4 w-4" />
							{mockProperty.location}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Badge variant={getStatusBadgeVariant(mockProperty.status)}>
						{mockProperty.status}
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
								${mockProperty.price.toLocaleString()}
							</div>
							<p className="text-muted-foreground text-sm">Listed Price</p>
						</div>
						<div className="flex items-center space-x-2">
							<IconBed className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{mockProperty.bedrooms}</div>
								<div className="text-muted-foreground text-sm">Bedrooms</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconBath className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{mockProperty.bathrooms}</div>
								<div className="text-muted-foreground text-sm">Bathrooms</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconRuler className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">
									{mockProperty.area.toLocaleString()}
								</div>
								<div className="text-muted-foreground text-sm">Sq Ft</div>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<IconCar className="h-5 w-5 text-muted-foreground" />
							<div>
								<div className="font-semibold">{mockProperty.parking}</div>
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
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{mockProperty.images.map((image) => (
							<div
								key={image}
								className="flex aspect-video items-center justify-center rounded-lg bg-muted"
							>
								<span className="text-muted-foreground text-sm">
									Property Image
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Detailed Information Tabs */}
			<Tabs defaultValue="overview" className="space-y-4">
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="amenities">Amenities</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="history">History</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Description</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-relaxed">
									{mockProperty.description}
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
									<span className="font-medium">{mockProperty.type}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Year Built:</span>
									<span className="font-medium">{mockProperty.yearBuilt}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">Lot Size:</span>
									<span className="font-medium">
										{mockProperty.lotSize.toLocaleString()} sq ft
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-muted-foreground">
										Price per Sq Ft:
									</span>
									<span className="font-medium">
										$
										{Math.round(
											mockProperty.price / mockProperty.area,
										).toLocaleString()}
									</span>
								</div>
							</CardContent>
						</Card>

						<Card className="md:col-span-2">
							<CardHeader>
								<CardTitle>Key Features</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-2 md:grid-cols-2">
									{mockProperty.features.map((feature) => (
										<div key={feature} className="flex items-center space-x-2">
											<div className="h-2 w-2 rounded-full bg-primary" />
											<span className="text-sm">{feature}</span>
										</div>
									))}
								</div>
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
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{mockProperty.amenities.map((amenity) => {
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
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="analytics" className="space-y-4">
					<div className="grid gap-4 md:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="font-medium text-sm">
									Total Views
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl">
									{mockProperty.viewingStats.totalViews}
								</div>
								<p className="text-muted-foreground text-xs">All time</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="font-medium text-sm">
									Weekly Views
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl text-green-600">
									{mockProperty.viewingStats.weeklyViews}
								</div>
								<p className="text-muted-foreground text-xs">This week</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="font-medium text-sm">Inquiries</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl text-blue-600">
									{mockProperty.viewingStats.inquiries}
								</div>
								<p className="text-muted-foreground text-xs">Total received</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="font-medium text-sm">
									Tours Scheduled
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="font-bold text-2xl text-purple-600">
									{mockProperty.viewingStats.tours}
								</div>
								<p className="text-muted-foreground text-xs">This month</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="history" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Price History</CardTitle>
							<CardDescription>
								Track price changes and key events for this property
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{mockProperty.priceHistory.map((entry) => (
									<div
										key={`${entry.date}-${entry.price}`}
										className="flex items-center justify-between rounded-lg border p-4"
									>
										<div>
											<div className="font-medium">{entry.event}</div>
											<div className="text-muted-foreground text-sm">
												{entry.date}
											</div>
										</div>
										<div className="font-bold text-lg">
											${entry.price.toLocaleString()}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
