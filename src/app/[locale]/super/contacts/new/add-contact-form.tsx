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
import { PhoneInput } from '@/components/ui/phone-input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { Family } from '@/db/schema-auth';
import { useActionState } from '@/hooks/use-action-state';
import { zodResolver } from '@hookform/resolvers/zod';
import type { E164Number } from 'libphonenumber-js';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { addContact } from './actions';

const genders_enum = ['ذكر', 'أنثى'] as const;

const gender_type = z.enum(genders_enum, {
	required_error: 'الجنس مطلوب',
	invalid_type_error: 'الجنس غير صحيح',
});

const contactFormSchema = z.object({
	firstName: z.string().min(1, { message: 'الاسم الأول مطلوب' }),
	middleName: z.string().nullable(),
	previousFamilyName: z.string().optional(),
	birthYear: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear()), {
		message: 'سنة الميلاد يجب أن تكون بين 1900 والسنة الحالية'
	}),
	gender: gender_type.optional(),
	phone: z.union([z.string(), z.custom<E164Number>()]).optional(),
	homeNumber: z.string().min(1, { message: 'رقم المنزل مطلوب' }),
	streetNumber: z.string().optional(),
	personalNumber: z.string().min(1, { message: 'الرقم الشخصي مطلوب' }),
	town: z.string().min(1, { message: 'القرية مطلوبة' }),
	approved: z.boolean().default(false).optional(),
	contactConsent: z.boolean().default(false).optional(),
	optOut: z.boolean().default(false).optional(),
	familyId: z.string().min(1, { message: 'العائلة مطلوبة' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const defaultValues: ContactFormValues = {
	firstName: '',
	middleName: null,
	previousFamilyName: '',
	birthYear: '',
	gender: undefined,
	phone: '',
	homeNumber: '',
	streetNumber: '',
	personalNumber: '',
	town: '',
	approved: false,
	contactConsent: false,
	optOut: false,
	familyId: '',
};

export function AddContactForm({ families }: { families: Family[] }) {
	const t = useTranslations('super.contacts.new_contacts');
	const [state, action, isPending] = useActionState(addContact, {});

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues,
	});

	const onSubmit = (values: ContactFormValues) => {
		const formData = new FormData();
		Object.entries(values).forEach(([key, value]) => {
			if (typeof value === 'boolean') {
				formData.append(key, value ? 'true' : 'false');
			} else if (value !== undefined && value !== null) {
				formData.append(key, value as string);
			}
		});

		startTransition(() => {
			action(formData);
		});

		form.reset({
			...defaultValues,
			familyId: '',
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
				<h2 className="mb-4 text-xl font-semibold">{t('personal_info')}</h2>
				<div className="rtl grid grid-cols-1 gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('first_name')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.firstName ? 'border-red-500' : ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="middleName"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('middle_name')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										value={field.value ?? ''}
										onChange={(e) => field.onChange(e.target.value || null)}
										className={
											form.formState.errors.middleName ? 'border-red-500' : ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="previousFamilyName"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('previous_family')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.previousFamilyName
												? 'border-red-500'
												: ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="birthYear"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('birth_year')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										min="1900"
										max={new Date().getFullYear()}
										placeholder="مثال: 1990"
										className={
											form.formState.errors.birthYear ? 'border-red-500' : ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="gender"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('gender')}</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger
											className={
												form.formState.errors.gender ? 'border-red-500' : ''
											}
										>
											<SelectValue placeholder={t('select_gender')} />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{genders_enum.map((gender) => (
											<SelectItem key={gender} value={gender}>
												{gender}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="familyId"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('family')}</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder={t('select_family')} />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{families.map((family) => (
											<SelectItem
												key={family.id}
												value={family.id.toString()}
											>
												{family.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>
				</div>

				<h2 className="mb-4 text-xl font-semibold">{t('contact_info')}</h2>
				<div dir="rtl" className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('phone')}</FormLabel>
								<FormControl>
									<PhoneInput
										dir="rtl"
										{...field}
										value={field.value ?? ''}
										defaultCountry="IL"
										placeholder={t('phone_placeholder')}
										onChange={(value) => field.onChange(value || '')}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<h2 className="mb-4 text-xl font-semibold">{t('address_info')}</h2>
				<div className="rtl grid grid-cols-1 gap-4 md:grid-cols-4">
					<FormField
						control={form.control}
						name="personalNumber"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('personal_number')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.personalNumber
												? 'border-red-500'
												: ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="homeNumber"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('home_number')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.homeNumber ? 'border-red-500' : ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="streetNumber"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('hood')} (اختياري)</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.streetNumber
												? 'border-red-500'
												: ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="town"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('village')}</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={
											form.formState.errors.town ? 'border-red-500' : ''
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				<Button type="submit" className="w-full md:w-auto" disabled={isPending}>
					{isPending ? t('adding_contact') : t('add_contact')}
				</Button>
			</form>
		</Form>
	);
}
