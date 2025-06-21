'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { importContacts } from './actions';

export function ImportContacts() {
	const t = useTranslations('super.contacts.import');
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Only accept .xlsx files
		if (!file.name.endsWith('.xlsx')) {
			toast({
				title: t('error_title'),
				description: t('invalid_file_type'),
				variant: 'destructive',
			});
			return;
		}

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);

			const result = await importContacts(formData);

			if (result.success === true) {
				if (result.errors && result.errors.length > 0) {
					toast({
						title: t('partial_success_title'),
						description: t('partial_success_description', {
							succeeded: result.count || 0,
							failed: result.errors.length,
						}),
						variant: 'warning',
						duration: 10000,
					});
					console.error('Import errors:', result.errors);
				} else {
					toast({
						title: t('success_title'),
						description: t('success_description', { count: result.count || 0 }),
					});
				}
			} else if (result.success === false) {
				toast({
					title: t('error_title'),
					description: result.error || t('error_description'),
					variant: 'destructive',
				});
			} else {
				console.error('Unexpected import result:', result);
				toast({
					title: t('error_title'),
					description: t('error_description'),
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Error importing contacts:', error);
			toast({
				title: t('error_title'),
				description: t('error_description'),
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
			// Reset the input
			e.target.value = '';
		}
	};

	return (
		<Card>
			<CardContent className="pt-6" dir="rtl">
				<div className="space-y-4 text-right">
					<div>
						<h2 className="mb-2 text-lg font-semibold">{t('title')}</h2>
						<p className="mb-4 text-sm text-muted-foreground">{t('description')}</p>
					</div>

					<div className="flex flex-row-reverse items-center gap-4">
						<Input
							type="file"
							accept=".xlsx"
							onChange={handleFileChange}
							disabled={isLoading}
							className="max-w-sm"
						/>
						<Button disabled={isLoading} variant="outline">
							{isLoading ? t('importing') : t('import')}
						</Button>
					</div>

					<div className="space-y-2 text-sm text-muted-foreground">
						<p>{t('format_note')}</p>
						<div className="rounded-md bg-muted p-4">
							<pre className="text-xs">
								{`title: اللقب
firstName: الاسم الأول
middleName: اسم الأب (optional)
previousFamilyName: اسم العائلة (optional)
phone: رقم الهاتف (optional, e.g., 972xxxxxxxxx or 05xxxxxxxx)
homeNumber: رقم المنزل (e.g., 123)
street: الشارع/الحارة (e.g., Main St)
town: المدينة (e.g., CityName)
personalNumber: الرقم الشخصي (optional, e.g., 123456789)
familyId: رقم العائلة (e.g., 1)`}
							</pre>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
