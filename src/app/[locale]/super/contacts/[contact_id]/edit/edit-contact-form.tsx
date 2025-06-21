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
import { ContactWithHousehold } from '@/db/access-layer/contacts';
import { Family } from '@/db/schema-auth';
import { useActionState } from '@/hooks/use-action-state';
import { zodResolver } from '@hookform/resolvers/zod';
import type { E164Number } from 'libphonenumber-js';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { editContactAction } from './actions';

const genders_enum = ['ذكر', 'أنثى'] as const;

const gender_type = z.enum(genders_enum, {
	required_error: 'الجنس مطلوب',
	invalid_type_error: 'الجنس غير صحيح',
});

const contactFormSchema = z.object({
	firstName: z.string().min(1, {
		message: 'الاسم الأول مطلوب',
	}),
	middleName: z.string().nullable(),
	previousFamilyName: z.string().optional(),
	birthYear: z.string().optional().refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 1900 && Number(val) <= new Date().getFullYear()), {
		message: 'سنة الميلاد يجب أن تكون بين 1900 والسنة الحالية'
	}),
	gender: gender_type.optional(),
	phone: z.union([z.string(), z.custom<E164Number>()]).optional(),
	homeNumber: z.string().min(1, {
		message: 'رقم المنزل مطلوب',
	}),
	streetNumber: z.string().optional(),
	personalNumber: z.string().min(1, {
		message: 'الرقم الشخصي مطلوب',
	}),
	town: z.string().min(1, {
		message: 'القرية مطلوبة',
	}),
	approved: z.boolean().default(false).optional(),
	contactConsent: z.boolean().default(false).optional(),
	optOut: z.boolean().default(false).optional(),
	familyId: z.string().min(1, {
		message: 'العائلة مطلوبة',
	}),
});

interface EditContactFormProps {
	contact: ContactWithHousehold;
	families: Family[];
}

export function EditContactForm({ contact, families }: EditContactFormProps) {
	const t = useTranslations('super.contacts.edit_contact_form');

	const [state, action, isPending] = useActionState(editContactAction, {});

	const form = useForm<z.infer<typeof contactFormSchema>>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			firstName: contact.firstName,
			middleName: contact.middleName,
			previousFamilyName: contact.previousFamilyName || '',
			birthYear: contact.birthYear?.toString() || '',
			gender: contact.gender as (typeof genders_enum)[number] || undefined,
			phone: contact.phone || '',
			homeNumber: contact.household?.number?.toString() || '',
			streetNumber: contact.household?.street || '',
			personalNumber: contact.personalNumber?.toString() || '',
			town: contact.household?.town || '',
			approved: contact.approved,
			contactConsent: !!contact.contactConsentAt,
			optOut: !!contact.optOutAt,
			familyId: contact.familyId?.toString() || '',
		},
	});

	const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
		const formData = new FormData();

		// Add contact ID
		formData.append('id', contact.id.toString());

		// Add all form values to FormData
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
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
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
						name="familyId"
						render={({ field }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('family')}</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value.toString()}
								>
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
				</div>

				<div className="rtl grid grid-cols-1 gap-4 md:grid-cols-1">
					<FormField
						control={form.control}
						name="phone"
						render={({ field: { onChange, ...field } }) => (
							<FormItem>
								<div className="h-5">
									<FormMessage className="text-sm text-red-500" />
								</div>
								<FormLabel>{t('phone')}</FormLabel>
								<FormControl>
									<PhoneInput
										dir="rtl"
										{...field}
										defaultCountry="IL"
										placeholder={t('phone_placeholder')}
										onChange={(value) => onChange(value || undefined)}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

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
								<FormLabel>{t('street_number')} (اختياري)</FormLabel>
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
								<FormLabel>{t('town')}</FormLabel>
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

				<div className="rtl grid grid-cols-1 gap-4 md:grid-cols-2">
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
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value as string}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder={t('select_gender')} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="ذكر">ذكر</SelectItem>
											<SelectItem value="أنثى">أنثى</SelectItem>
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>

				{/* <div className="rtl grid grid-cols-1 gap-4 md:grid-cols-3">
					<FormField
						control={form.control}
						name="approved"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>{t('approved')}</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="contactConsent"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>{t('contact_consent')}</FormLabel>
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="optOut"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0 rtl:space-x-reverse">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>{t('opt_out')}</FormLabel>
								</div>
							</FormItem>
						)}
					/>
				</div> */}

				<div className="flex justify-end">
					<Button type="submit" disabled={isPending} className="w-full md:w-auto">
						{isPending ? t('saving') : t('save')}
					</Button>
				</div>
			</form>
		</Form>
	);
}
