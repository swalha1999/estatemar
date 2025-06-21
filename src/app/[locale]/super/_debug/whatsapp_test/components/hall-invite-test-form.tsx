'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/uploads/image-uploader';
import { useActionState } from '@/hooks/use-action-state';
import { useTranslations } from 'next-intl';
import { sendHallInviteMessageAction } from '../actions';
import { 
	Heart, 
	Calendar, 
	Clock, 
	MapPin, 
	Users, 
	Phone, 
	Camera,
	Send 
} from 'lucide-react';
import { useState } from 'react';

export default function HallInviteTestForm() {
	const t = useTranslations('admin.page.debug.whatsapp_test.hall_invite_v2_form');
	const [state, formAction, isPending] = useActionState(sendHallInviteMessageAction, {});
	const [imageKey, setImageKey] = useState<string>('');

	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<div className="text-center">
				<h2 className="text-3xl font-bold tracking-tight">اختبار دعوة القاعة</h2>
				<p className="text-muted-foreground">قم بملء البيانات التالية لإرسال دعوة القاعة عبر واتساب</p>
			</div>

			<form action={formAction} className="space-y-6">
				{/* Event Information Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Heart className="h-5 w-5 text-rose-500" />
							بيانات المناسبة
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="groomName" className="flex items-center gap-2">
									<Users className="h-4 w-4 text-blue-500" />
									{t('groomName')}
								</Label>
								<Input
									id="groomName"
									name="groomName"
									placeholder={t('groomName')}
									required
									className="transition-all focus:ring-2 focus:ring-blue-500/20"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="brideName" className="flex items-center gap-2">
									<Heart className="h-4 w-4 text-pink-500" />
									{t('brideName')}
								</Label>
								<Input
									id="brideName"
									name="brideName"
									placeholder={t('brideName')}
									required
									className="transition-all focus:ring-2 focus:ring-pink-500/20"
								/>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="date" className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-green-500" />
									{t('date')}
								</Label>
								<Input
									id="date"
									name="date"
									type="date"
									required
									className="transition-all focus:ring-2 focus:ring-green-500/20"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="time" className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-amber-500" />
									{t('time')}
								</Label>
								<Input
									id="time"
									name="time"
									type="time"
									required
									className="transition-all focus:ring-2 focus:ring-amber-500/20"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="address" className="flex items-center gap-2">
								<MapPin className="h-4 w-4 text-red-500" />
								{t('address')}
							</Label>
							<Input
								id="address"
								name="address"
								placeholder={t('address')}
								required
								className="transition-all focus:ring-2 focus:ring-red-500/20"
							/>
						</div>
					</CardContent>
				</Card>

				{/* People Information Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5 text-blue-500" />
							بيانات الأشخاص
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="inviterName" className="flex items-center gap-2">
									<Users className="h-4 w-4 text-indigo-500" />
									{t('inviterName')}
								</Label>
								<Input
									id="inviterName"
									name="inviterName"
									placeholder={t('inviterName')}
									required
									className="transition-all focus:ring-2 focus:ring-indigo-500/20"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="recipientName" className="flex items-center gap-2">
									<Users className="h-4 w-4 text-purple-500" />
									{t('recipientName')}
								</Label>
								<Input
									id="recipientName"
									name="recipientName"
									placeholder={t('recipientName')}
									required
									className="transition-all focus:ring-2 focus:ring-purple-500/20"
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Contact Information Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Phone className="h-5 w-5 text-green-500" />
							معلومات الاتصال
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Label htmlFor="phoneNumber" className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-green-500" />
								{t('phoneNumber')}
							</Label>
							<Input
								id="phoneNumber"
								name="phoneNumber"
								type="tel"
								placeholder={t('phoneNumber')}
								required
								className="transition-all focus:ring-2 focus:ring-green-500/20"
								dir="ltr"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Image Upload Card */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Camera className="h-5 w-5 text-violet-500" />
							{t('image')}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ImageUploader
							onUploadComplete={(key) => setImageKey(key)}
							title="صورة الدعوة"
							maxSizeMB={10}
						/>
						<input
							type="hidden"
							name="imageKey"
							value={imageKey}
						/>
					</CardContent>
				</Card>

				{/* Submit Button */}
				<Card>
					<CardContent className="pt-6">
						<Button 
							type="submit" 
							disabled={isPending} 
							className="w-full h-12 text-lg font-semibold transition-all hover:scale-105"
							size="lg"
						>
							{isPending ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
									{t('sending')}
								</>
							) : (
								<>
									<Send className="mr-2 h-5 w-5" />
									{t('send_message')}
								</>
							)}
						</Button>
					</CardContent>
				</Card>

				{/* Status Messages */}
				{state.message === 'success' && (
					<Card className="border-green-200 bg-green-50">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3 text-green-800">
								<div className="h-2 w-2 rounded-full bg-green-500" />
								<span className="font-medium">تم إرسال الرسالة بنجاح!</span>
							</div>
						</CardContent>
					</Card>
				)}

				{state.message === 'error' && (
					<Card className="border-red-200 bg-red-50">
						<CardContent className="pt-6">
							<div className="flex items-center gap-3 text-red-800">
								<div className="h-2 w-2 rounded-full bg-red-500" />
								<span className="font-medium">حدث خطأ أثناء إرسال الرسالة</span>
							</div>
						</CardContent>
					</Card>
				)}
			</form>
		</div>
	);
} 