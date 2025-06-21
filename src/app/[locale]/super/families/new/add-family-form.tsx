'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useActionState } from '@/hooks/use-action-state';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addFamily } from './actions';

const familyFormSchema = z.object({
	name: z.string().min(1, {
		message: 'Family name is required',
	}),
});

export function AddFamilyForm() {
	const t = useTranslations('super.families.new');

	const [state, action, isPending] = useActionState(addFamily, {});

	const form = useForm<z.infer<typeof familyFormSchema>>({
		resolver: zodResolver(familyFormSchema),
		defaultValues: {
			name: '',
		},
	});

	const onSubmit = (values: z.infer<typeof familyFormSchema>) => {
		const formData = new FormData();
		formData.append('name', values.name);

		startTransition(() => {
			action(formData);
		});

		form.reset({
			name: '',
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<div className="h-5">
								<FormMessage className="text-sm text-red-500" />
							</div>
							<FormLabel>{t('family_name')}</FormLabel>
							<FormControl>
								<Input
									{...field}
									className={form.formState.errors.name ? 'border-red-500' : ''}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full md:w-auto" disabled={isPending}>
					{isPending ? t('adding_family') : t('add_family')}
				</Button>
			</form>
		</Form>
	);
}
