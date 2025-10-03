"use client";

import { useQuery } from "@tanstack/react-query";
import { Building2, Eye, Home, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { orpc } from "@/utils/orpc";

export default function PropertiesPage() {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [listingType, setListingType] = useState<string | undefined>(undefined);
	const [propertyType, setPropertyType] = useState<string | undefined>(
		undefined,
	);

	const { data, isLoading } = useQuery(orpc.realEstate.property.getMyProperties.queryOptions({
        input:{
            page,
            limit: 20,
            listingType,
        }
    }));

	const properties = data?.data?.properties || [];
	const pagination = data?.data?.pagination;

	return (
		<div className="container mx-auto space-y-8 py-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">My Properties</h1>
					<p className="text-muted-foreground">Manage your property listings</p>
				</div>
				<Button asChild>
					<Link href="/dashboard/properties/new">
						<Plus className="mr-2 h-4 w-4" />
						Add Property
					</Link>
				</Button>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Total Properties
						</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{pagination?.total || 0}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">For Sale</CardTitle>
						<Home className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{properties.filter((p) => p.listingType === "buy").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">For Rent</CardTitle>
						<Building2 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{properties.filter((p) => p.listingType === "rent").length}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Tracking</CardTitle>
						<Eye className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{properties.filter((p) => p.listingType === "track").length}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search properties..."
						className="pl-10"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<Select value={listingType} onValueChange={setListingType}>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Listing Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="rent">For Rent</SelectItem>
						<SelectItem value="buy">For Sale</SelectItem>
						<SelectItem value="track">Tracking</SelectItem>
					</SelectContent>
				</Select>
				<Select value={propertyType} onValueChange={setPropertyType}>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="Property Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Properties</SelectItem>
						<SelectItem value="apartment">Apartment</SelectItem>
						<SelectItem value="villa">Villa</SelectItem>
						<SelectItem value="house">House</SelectItem>
						<SelectItem value="townhouse">Townhouse</SelectItem>
						<SelectItem value="office">Office</SelectItem>
						<SelectItem value="land">Land</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{isLoading ? (
					Array.from({ length: 6 }).map((_, i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-48 w-full" />
							</CardHeader>
							<CardContent>
								<Skeleton className="mb-2 h-4 w-3/4" />
								<Skeleton className="h-4 w-1/2" />
							</CardContent>
						</Card>
					))
				) : properties.length === 0 ? (
					<div className="col-span-full py-12 text-center">
						<Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
						<h3 className="mb-2 font-semibold text-lg">No properties yet</h3>
						<p className="mb-4 text-muted-foreground">
							Get started by adding your first property
						</p>
						<Button asChild>
							<Link href="/dashboard/properties/new">Add Property</Link>
						</Button>
					</div>
				) : (
					properties.map((property) => (
						<Card key={property.id} className="overflow-hidden">
							<CardHeader className="p-0">
								<div className="relative h-48 bg-muted">
									{property.images &&
									Array.isArray(property.images) &&
									(property.images as string[]).length > 0 ? (
										<div className="relative h-full w-full">
											<img
												src={(property.images as string[])[0]}
												alt={property.title}
												className="h-full w-full object-cover"
											/>
										</div>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<Building2 className="h-12 w-12 text-muted-foreground" />
										</div>
									)}
									<div className="absolute top-2 right-2 space-x-2">
										<Badge
											variant={
												(property.isActive ?? true) ? "default" : "secondary"
											}
										>
											{(property.isActive ?? true) ? "Active" : "Inactive"}
										</Badge>
									</div>
									<div className="absolute top-2 left-2">
										<Badge variant="secondary">
											{property.listingType === "rent"
												? "For Rent"
												: property.listingType === "buy"
													? "For Sale"
													: "Tracking"}
										</Badge>
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4">
								<CardTitle className="mb-2 line-clamp-1">
									{property.title}
								</CardTitle>
								<CardDescription className="mb-3 line-clamp-2">
									{property.description}
								</CardDescription>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="font-bold text-2xl">
											{property.currency}{" "}
											{Number(property.price).toLocaleString()}
										</span>
									</div>
									<div className="flex items-center gap-4 text-muted-foreground text-sm">
										{property.bedrooms && <span>{property.bedrooms} beds</span>}
										{property.bathrooms && (
											<span>{property.bathrooms} baths</span>
										)}
										{property.size && <span>{property.size} m²</span>}
									</div>
									<div className="text-muted-foreground text-sm">
										{property.area}, {property.city}
									</div>
									<div className="flex items-center gap-2 text-muted-foreground text-sm">
										<Eye className="h-4 w-4" />
										<span>{property.views} views</span>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex gap-2 p-4 pt-0">
								<Button variant="outline" className="flex-1" asChild>
									<Link href={`/dashboard/properties/${property.id}`}>
										View
									</Link>
								</Button>
								<Button className="flex-1" asChild>
									<Link
										href={`/dashboard/properties/${property.id}/edit`}
									>
										Edit
									</Link>
								</Button>
							</CardFooter>
						</Card>
					))
				)}
			</div>

			{pagination && pagination.totalPages > 1 && (
				<div className="flex items-center justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
					>
						Previous
					</Button>
					<span className="text-muted-foreground text-sm">
						Page {page} of {pagination.totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() => setPage((p) => p + 1)}
						disabled={page === pagination.totalPages}
					>
						Next
					</Button>
				</div>
			)}
		</div>
	);
}
