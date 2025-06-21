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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { createUserAction } from './actions';

interface CreateUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		isAdmin: false,
		isSuperAdmin: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const t = useTranslations('super.users');
	const { toast } = useToast();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) return;

		setIsLoading(true);
		try {
			const result = await createUserAction(formData);
			if (result.is_success) {
				toast({
					title: t('toast.success'),
					description: t('toast.user_created'),
				});
				setFormData({
					username: '',
					email: '',
					password: '',
					isAdmin: false,
					isSuperAdmin: false,
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
		setFormData({
			username: '',
			email: '',
			password: '',
			isAdmin: false,
			isSuperAdmin: false,
		});
		onOpenChange(false);
	};

	const updateFormData = (field: string, value: string | boolean) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>{t('create_user_dialog.title')}</DialogTitle>
						<DialogDescription>
							{t('create_user_dialog.description')}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="username">{t('create_user_dialog.username')}</Label>
							<Input
								id="username"
								type="text"
								value={formData.username}
								onChange={(e) => updateFormData('username', e.target.value)}
								placeholder={t('create_user_dialog.username_placeholder')}
								required
								minLength={4}
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email">{t('create_user_dialog.email')}</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => updateFormData('email', e.target.value)}
								placeholder={t('create_user_dialog.email_placeholder')}
								required
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="password">{t('create_user_dialog.password')}</Label>
							<Input
								id="password"
								type="password"
								value={formData.password}
								onChange={(e) => updateFormData('password', e.target.value)}
								placeholder={t('create_user_dialog.password_placeholder')}
								required
								minLength={8}
								disabled={isLoading}
							/>
						</div>
						<div className="grid gap-2">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="isAdmin"
									checked={formData.isAdmin}
									onCheckedChange={(checked) => updateFormData('isAdmin', checked as boolean)}
									disabled={isLoading}
								/>
								<Label htmlFor="isAdmin">{t('create_user_dialog.is_admin')}</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="isSuperAdmin"
									checked={formData.isSuperAdmin}
									onCheckedChange={(checked) => updateFormData('isSuperAdmin', checked as boolean)}
									disabled={isLoading}
								/>
								<Label htmlFor="isSuperAdmin">{t('create_user_dialog.is_super_admin')}</Label>
							</div>
						</div>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleCancel}
							disabled={isLoading}
						>
							{t('create_user_dialog.cancel')}
						</Button>
						<Button type="submit" disabled={isLoading || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()}>
							{isLoading ? t('create_user_dialog.creating') : t('create_user_dialog.create')}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
} 