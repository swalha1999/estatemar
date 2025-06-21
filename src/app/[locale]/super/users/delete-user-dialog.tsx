'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { deleteUserAction } from './actions';

interface DeleteUserDialogProps {
	userId: number | null;
	username: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({ userId, username, open, onOpenChange }: DeleteUserDialogProps) {
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations('super.users');
	const { toast } = useToast();
	const router = useRouter();

	const handleDelete = async () => {
		if (!userId) return;

		setIsLoading(true);
		try {
			const result = await deleteUserAction(userId);
			if (result.is_success) {
				toast({
					title: t('toast.success'),
					description: t('toast.user_deleted'),
				});
				onOpenChange(false);
				router.refresh();
			} else {
				toast({
					title: t('toast.error'),
					description: t('toast.error_message'),
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: t('toast.error'),
				description: t('toast.error_message'),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t('delete_user_dialog.title')}</DialogTitle>
					<DialogDescription>
						{t('delete_user_dialog.description', { username })}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={handleCancel}
						disabled={isLoading}
					>
						{t('delete_user_dialog.cancel')}
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleDelete}
						disabled={isLoading}
					>
						{isLoading ? t('delete_user_dialog.deleting') : t('delete_user_dialog.confirm')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 