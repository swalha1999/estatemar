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
import { changeUserPasswordAction } from './actions';

interface ChangePasswordDialogProps {
	userId: number;
	username: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({ userId, username, open, onOpenChange }: ChangePasswordDialogProps) {
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations('super.users');
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!password.trim()) return;

		setIsLoading(true);
		try {
			const result = await changeUserPasswordAction(userId, password);
			if (result.is_success) {
				toast({
					title: t('toast.success'),
					description: t('toast.password_changed'),
				});
				setPassword('');
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
		setPassword('');
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{t('change_password_dialog.title')}</DialogTitle>
						<DialogDescription>
							{t('change_password_dialog.description')} ({username})
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="password">{t('change_password_dialog.new_password')}</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder={t('change_password_dialog.new_password_placeholder')}
								required
								minLength={8}
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
							{t('change_password_dialog.cancel')}
						</Button>
						<Button type="submit" disabled={isLoading || !password.trim()}>
							{isLoading ? t('change_password_dialog.changing') : t('change_password_dialog.confirm')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 