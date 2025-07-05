'use client';

import { Property } from '@/data/access-layer-v2/schemas/property.schema';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface EditPropertyDialogProps {
	property: Property;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditPropertyDialog({ property, open, onOpenChange }: EditPropertyDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Property</DialogTitle>
					<DialogDescription>
						Edit property: {property.title}
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p className="text-muted-foreground">Edit form will be implemented here</p>
				</div>
			</DialogContent>
		</Dialog>
	);
} 