'use client';

import { useState } from 'react';
import { Property } from '@/data/access-layer-v2/schemas/property.schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PropertiesTable } from '@/app/[locale]/super/properties/components/properties-table';
import { DeletePropertyDialog } from '@/app/[locale]/super/properties/components/delete-property-dialog';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface PropertyManagementProps {
	properties: Property[];
	total: number;
	totalPages: number;
	currentPage: number;
	limit: number;
}

export function PropertyManagement({ 
	properties, 
	total, 
	totalPages, 
	currentPage, 
	limit 
}: PropertyManagementProps) {
	const t = useTranslations('properties');
	const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex gap-2">
					{/* Add filters here later */}
				</div>
				<Link href="/super/properties/create">
					<Button>
						<Plus className="mr-2 h-4 w-4" />
						Add Property
					</Button>
				</Link>
			</div>

			<PropertiesTable
				properties={properties}
				onEdit={(property) => {
					// Navigate to edit page
					window.location.href = `/super/properties/${property.id}/edit`;
				}}
				onDelete={setDeletingProperty}
			/>

			{deletingProperty && (
				<DeletePropertyDialog
					property={deletingProperty}
					open={!!deletingProperty}
					onOpenChange={(open) => !open && setDeletingProperty(null)}
				/>
			)}
		</div>
	);
} 