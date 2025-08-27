"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

// Mock data for properties
const mockProperties = [
	{
		id: "1",
		name: "Luxury Villa with Ocean View",
		price: 2500000,
		location: "Miami Beach, FL",
		status: "For Sale",
		type: "Villa",
		bedrooms: 5,
		bathrooms: 4,
		area: 3500,
		images: ["/property-1.jpg"],
		description: "Stunning oceanfront villa with panoramic views...",
	},
	{
		id: "2",
		name: "Modern Downtown Apartment",
		price: 850000,
		location: "Downtown, Miami",
		status: "Sold",
		type: "Apartment",
		bedrooms: 2,
		bathrooms: 2,
		area: 1200,
		images: ["/property-2.jpg"],
		description: "Contemporary apartment in the heart of the city...",
	},
	{
		id: "3",
		name: "Family Home with Garden",
		price: 675000,
		location: "Coral Gables, FL",
		status: "For Sale",
		type: "House",
		bedrooms: 4,
		bathrooms: 3,
		area: 2800,
		images: ["/property-3.jpg"],
		description: "Beautiful family home with spacious garden...",
	},
	{
		id: "4",
		name: "Beachside Condo",
		price: 1200000,
		location: "South Beach, FL",
		status: "Pending",
		type: "Condo",
		bedrooms: 3,
		bathrooms: 2,
		area: 1800,
		images: ["/property-4.jpg"],
		description: "Luxury beachside condominium with resort amenities...",
	},
];

export default function PropertiesPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const searchId = useId();

	useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (!session || isPending) {
		return <div>Loading...</div>;
	}

	const filteredProperties = mockProperties.filter((property) => {
		const matchesSearch =
			property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			property.location.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			statusFilter === "all" ||
			property.status.toLowerCase().replace(" ", "") === statusFilter;
		const matchesType =
			typeFilter === "all" || property.type.toLowerCase() === typeFilter;

		return matchesSearch && matchesStatus && matchesType;
	});

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
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">My Properties</h1>
					<p className="text-muted-foreground">
						Manage your property listings and track their performance
					</p>
				</div>
				<Link href="/dashboard/properties/add">
					<Button>Add New Property</Button>
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-sm">
							Total Properties
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{mockProperties.length}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-sm">For Sale</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl text-green-600">
							{mockProperties.filter((p) => p.status === "For Sale").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-sm">Sold</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl text-blue-600">
							{mockProperties.filter((p) => p.status === "Sold").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="font-medium text-sm">Total Value</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							$
							{mockProperties
								.reduce((sum, p) => sum + p.price, 0)
								.toLocaleString()}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle>Filter Properties</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor={searchId}>Search</Label>
							<Input
								id={searchId}
								placeholder="Search by name or location..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="status-filter">Status</Label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger>
									<SelectValue placeholder="All Statuses" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Statuses</SelectItem>
									<SelectItem value="forsale">For Sale</SelectItem>
									<SelectItem value="sold">Sold</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="type-filter">Type</Label>
							<Select value={typeFilter} onValueChange={setTypeFilter}>
								<SelectTrigger>
									<SelectValue placeholder="All Types" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="villa">Villa</SelectItem>
									<SelectItem value="apartment">Apartment</SelectItem>
									<SelectItem value="house">House</SelectItem>
									<SelectItem value="condo">Condo</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Properties Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{filteredProperties.map((property) => (
					<Card
						key={property.id}
						className="overflow-hidden transition-shadow hover:shadow-lg"
					>
						<div className="relative aspect-video bg-muted">
							<div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
								Property Image
							</div>
						</div>
						<CardHeader>
							<div className="flex items-start justify-between">
								<div className="space-y-1">
									<CardTitle className="line-clamp-1">
										{property.name}
									</CardTitle>
									<CardDescription>{property.location}</CardDescription>
								</div>
								<Badge variant={getStatusBadgeVariant(property.status)}>
									{property.status}
								</Badge>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="font-bold text-2xl text-primary">
								${property.price.toLocaleString()}
							</div>
							<div className="flex justify-between text-muted-foreground text-sm">
								<span>{property.bedrooms} bed</span>
								<span>{property.bathrooms} bath</span>
								<span>{property.area.toLocaleString()} sqft</span>
							</div>
							<p className="line-clamp-2 text-muted-foreground text-sm">
								{property.description}
							</p>
							<div className="flex space-x-2">
								<Link
									href={`/dashboard/properties/${property.id}`}
									className="flex-1"
								>
									<Button variant="outline" className="w-full">
										View Details
									</Button>
								</Link>
								<Link
									href={`/dashboard/properties/${property.id}/edit`}
									className="flex-1"
								>
									<Button className="w-full">Edit</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{filteredProperties.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-muted-foreground">
						No properties found matching your criteria.
					</p>
					<Link href="/dashboard/properties/add">
						<Button className="mt-4">Add Your First Property</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
