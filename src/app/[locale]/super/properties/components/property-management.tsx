'use client';

import { useState } from 'react';
import { Property } from '@/data/access-layer-v2/schemas/property.schema';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PropertiesTable } from '@/app/[locale]/super/properties/components/properties-table';
import { CreatePropertyDialog } from '@/app/[locale]/super/properties/components/create-property-dialog';
import { EditPropertyDialog } from '@/app/[locale]/super/properties/components/edit-property-dialog';
import { DeletePropertyDialog } from '@/app/[locale]/super/properties/components/delete-property-dialog';
import { useTranslations } from 'next-intl';

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
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingProperty, setEditingProperty] = useState<Property | null>(null);
	const [deletingProperty, setDeletingProperty] = useState<Property | null>(null);

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex gap-2">
					{/* Add filters here later */}
				</div>
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Property
				</Button>
			</div>

			<PropertiesTable
				properties={properties}
				onEdit={setEditingProperty}
				onDelete={setDeletingProperty}
			/>

			<CreatePropertyDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
			/>

			{editingProperty && (
				<EditPropertyDialog
					property={editingProperty}
					open={!!editingProperty}
					onOpenChange={(open) => !open && setEditingProperty(null)}
				/>
			)}

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