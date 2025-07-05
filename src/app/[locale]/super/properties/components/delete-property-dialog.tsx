'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/data/access-layer-v2/schemas/property.schema';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteProperty } from '../actions';
import { useToast } from '@/hooks/use-toast';

interface DeletePropertyDialogProps {
	property: Property;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeletePropertyDialog({ property, open, onOpenChange }: DeletePropertyDialogProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			const result = await deleteProperty(property.id);

			if (result.success) {
				toast({
					title: 'Success',
					description: 'Property deleted successfully',
				});
				onOpenChange(false);
				router.refresh();
			} else {
				toast({
					title: 'Error',
					description: result.error || 'Failed to delete property',
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An unexpected error occurred',
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently delete the property "{property.title}" and all associated images.
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						disabled={isDeleting}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isDeleting ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
} 