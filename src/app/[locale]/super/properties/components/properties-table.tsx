'use client';

import { Property } from '@/data/access-layer-v2/schemas/property.schema';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Home, Building2, Castle, Store, TreePine } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PropertiesTableProps {
	properties: Property[];
	onEdit: (property: Property) => void;
	onDelete: (property: Property) => void;
}

const propertyTypeIcons = {
	villa: Castle,
	apartment: Building2,
	house: Home,
	commercial: Store,
	land: TreePine,
	other: Home,
};

export function PropertiesTable({ properties, onEdit, onDelete }: PropertiesTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Listing</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Location</TableHead>
						<TableHead>Bedrooms</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Featured</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{properties.map((property) => {
						const Icon = propertyTypeIcons[property.propertyType as keyof typeof propertyTypeIcons] || Home;
						
						return (
							<TableRow key={property.id}>
								<TableCell className="font-medium">{property.title}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Icon className="h-4 w-4" />
										<span className="capitalize">{property.propertyType}</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={property.listingType === 'sale' ? 'default' : 'secondary'}>
										{property.listingType}
									</Badge>
								</TableCell>
								<TableCell>
									{formatCurrency(parseFloat(property.price))}
								</TableCell>
								<TableCell>{property.location}</TableCell>
								<TableCell>{property.bedrooms}</TableCell>
								<TableCell>
									<Badge variant={property.isAvailable ? 'default' : 'destructive'}>
										{property.isAvailable ? 'Available' : 'Unavailable'}
									</Badge>
								</TableCell>
								<TableCell>
									<Badge variant={property.isFeatured ? 'default' : 'outline'}>
										{property.isFeatured ? 'Featured' : 'Not Featured'}
									</Badge>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<Button
											variant="outline"
											size="icon"
											onClick={() => onEdit(property)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => onDelete(property)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					})}
					{properties.length === 0 && (
						<TableRow>
							<TableCell colSpan={9} className="text-center">
								No properties found
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
} 