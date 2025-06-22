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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { changeUsernameAction } from './actions';

interface ChangeUsernameDialogProps {
	userId: number;
	currentUsername: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ChangeUsernameDialog({ userId, currentUsername, open, onOpenChange }: ChangeUsernameDialogProps) {
	const [username, setUsername] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations('super.users.change_username_dialog');
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!username.trim()) return;

		setIsLoading(true);
		try {
			const result = await changeUsernameAction(userId, username);
			if (result.is_success) {
				toast({
					title: t('toast.success'),
					description: t('toast.username_changed'),
				});
				setUsername('');
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
		setUsername('');
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{t('title')}</DialogTitle>
						<DialogDescription>
							{t('description')} ({currentUsername})
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="username">{t('new_username')}</Label>
							<Input
								id="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder={t('new_username_placeholder')}
								required
								minLength={3}
								disabled={isLoading}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
						>
							{t('cancel')}
						</Button>
						<Button type="submit" disabled={isLoading || !username.trim()}>
							{isLoading ? t('changing') : t('confirm')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 