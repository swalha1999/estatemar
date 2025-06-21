'use client';

import { DropdownFilter } from '@/components/dropdown-filter';
import { Pagination } from '@/components/pagination';
import { SearchInput } from '@/components/search-input';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { type ConsentStatus, type ContactSearchParams } from '@/db/access-layer-v2/interfaces/contact.interface';
import { Contact } from '@/db/schema-auth';
import { useAuth } from '@/providers/auth-provider';
import { AlertTriangle, Building2, CheckCircle, Filter, MessageCircle, MessageSquare, MoreVertical, Pencil, RotateCcw, Trash2, UserCheck, UserMinus, Users, UserX, XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { approveContactAction, bulkApproveContactsAction, bulkUnapproveContactsAction, deleteContactAction, markContactAsOptOutAction, resetConcentStatusAction, sendConcentMessageAction, unapproveContactAction, updateContactStatusAction } from './actions';

const getConsentStatus = (contact: any): ConsentStatus => {
	if (contact.contactConsent) return 'gave_consent';
	if (contact.optOut) return 'declined';
	if (contact.concentMessageFailed) return 'concent_message_failed';
	if (!contact.concentMessageSent) return 'concent_message_not_sent';
	return 'no_response';
};

const ConsentBadge = ({ status }: { status: ConsentStatus }) => {
	const t = useTranslations('super.contacts.contacts_list.consent_status');

	const statusConfig = {
		gave_consent: {
			color: 'bg-emerald-400',
			label: t('gave_consent'),
		},
		no_response: {
			color: 'bg-amber-400',
			label: t('no_response'),
		},
		declined: {
			color: 'bg-rose-500',
			label: t('declined'),
		},
		concent_message_not_sent: {
			color: 'bg-slate-400',
			label: t('concent_message_not_sent'),
		},
		concent_message_failed: {
			color: 'bg-red-600',
			label: t('concent_message_failed'),
		},
	};

	return <StatusBadge status={status} config={statusConfig} />;
};

interface ContactsListProps {
	contacts: any[];
	towns: string[];
	streets: string[];
	families: string[];
	stats: {
		totalContacts: number;
		totalHouseholds: number;
		totalOptedIn: number;
		totalDeclined: number;
		totalDidntRespond: number;
		totalFailed: number;
		totalDidntSend: number;
	};
	totalPages: number;
	totalContacts: number;
	searchParams?: ContactSearchParams;
}

const ContactsPagination = ({
	currentPage,
	totalPages,
}: {
	currentPage: number;
	totalPages: number;
}) => {
	const t = useTranslations('super.contacts.contacts_list');

	return (
		<Pagination
			currentPage={currentPage}
			totalPages={totalPages}
			labels={{
				page: t('page'),
				of: t('of'),
				firstPage: t('first_page'),
				previousPage: t('previous_page'),
				nextPage: t('next_page'),
				lastPage: t('last_page'),
			}}
		/>
	);
};

const StatsSection = ({ stats, t }: { stats: ContactsListProps['stats'], t: any }) => {
	const statItems = [
		{ icon: Users, label: t('total_contacts'), value: stats.totalContacts, color: 'text-blue-600' },
		{ icon: Building2, label: t('total_households'), value: stats.totalHouseholds, color: 'text-purple-600' },
		{ icon: UserCheck, label: t('total_opted_in'), value: stats.totalOptedIn, color: 'text-emerald-600' },
		{ icon: UserX, label: t('total_declined'), value: stats.totalDeclined, color: 'text-rose-600' },
		{ icon: MessageCircle, label: t('total_didnt_respond'), value: stats.totalDidntRespond, color: 'text-amber-600' },
		{ icon: AlertTriangle, label: t('total_failed'), value: stats.totalFailed, color: 'text-red-600' },
		{ icon: MessageSquare, label: t('total_didnt_send'), value: stats.totalDidntSend, color: 'text-slate-600' },
	];

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
			{statItems.map((stat, index) => {
				const Icon = stat.icon;
				return (
					<div key={index} className="flex items-center gap-3 rounded-lg border p-3 bg-card">
						<div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 ${stat.color}`}>
							<Icon className="h-5 w-5" />
						</div>
						<div className="flex flex-col">
							<span className="text-2xl font-bold">{stat.value}</span>
							<span className="text-xs text-muted-foreground">{stat.label}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const FiltersSection = ({
	towns,
	streets,
	families,
	searchParams,
	t,
}: {
	towns: string[];
	streets: string[];
	families: string[];
	searchParams?: ContactSearchParams;
	t: any;
}) => {
	const consentOptions: { value: ConsentStatus, label: string }[] = [
		{ value: 'gave_consent', label: t('consent_status.gave_consent') },
		{ value: 'no_response', label: t('consent_status.no_response') },
		{ value: 'declined', label: t('consent_status.declined') },
		{ value: 'concent_message_not_sent', label: t('consent_status.concent_message_not_sent') },
		{ value: 'concent_message_failed', label: t('consent_status.concent_message_failed') },
	];

	const approvalOptions = [
		{ value: 'true', label: 'المعتمدين' },
		{ value: 'false', label: 'غير المعتمدين' },
	];

	return (
		<Card>
			<CardHeader className="pb-4">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Filter className="h-5 w-5" />
					المرشحات
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
					<DropdownFilter
						paramName="town"
						options={towns}
						selectedValue={searchParams?.town}
						allLabel="كل البلدات"
						title="البلدة"
						placeholder="اختر البلدة"
						dependentParams={['street']}
						width="w-full"
					/>
					<DropdownFilter
						paramName="street"
						options={streets}
						selectedValue={searchParams?.street}
						allLabel="كل الحارات"
						title="الحارة"
						placeholder="اختر الحارة"
						width="w-full"
					/>
					<DropdownFilter
						paramName="family"
						options={families}
						selectedValue={searchParams?.family}
						allLabel="كل العائلات"
						title="العائلة"
						placeholder="اختر العائلة"
						width="w-full"
					/>
					<DropdownFilter
						paramName="consentStatus"
						options={consentOptions}
						selectedValue={searchParams?.consentStatus}
						allLabel="كل الحالات"
						title="حالة الموافقة"
						placeholder="اختر الحالة"
						width="w-full"
					/>
					<DropdownFilter
						paramName="approved"
						options={approvalOptions}
						selectedValue={searchParams?.approved}
						allLabel="كل الحالات"
						title="حالة الاعتماد"
						placeholder="اختر حالة الاعتماد"
						width="w-full"
					/>
				</div>
			</CardContent>
		</Card>
	);
};

const AdminApprovalBadge = ({ approved }: { approved: boolean }) => {
	const t = useTranslations('super.contacts.contacts_list');
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Badge variant={approved ? 'default' : 'secondary'} className={approved ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
						{approved ? (
							<CheckCircle className="h-3 w-3 mr-1" />
						) : (
							<XCircle className="h-3 w-3 mr-1" />
						)}
						{approved ? 'معتمد' : 'غير معتمد'}
					</Badge>
				</TooltipTrigger>
				<TooltipContent>
					<p>{approved ? t('approved') : t('not_approved')}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

const ContactActionsDropdown = ({ contact, onEdit, onDelete, onOptOut, onSendConsent, onResetConsent, onApprove, onUnapprove, loading }: {
	contact: Contact;
	onEdit: () => void;
	onDelete: () => void;
	onOptOut: () => void;
	onSendConsent: () => void;
	onResetConsent: () => void;
	onApprove: () => void;
	onUnapprove: () => void;
	loading: boolean;
}) => {
	const t = useTranslations('super.contacts.contacts_list');
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" disabled={loading} aria-label={t('actions')}>
					<MoreVertical className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={onEdit} disabled={loading}>
					<Pencil className="h-4 w-4 mr-2" /> {t('action_edit')}
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onDelete} disabled={loading}>
					<Trash2 className="h-4 w-4 mr-2" /> {t('action_delete')}
				</DropdownMenuItem>
				{!contact.optOut && (
					<DropdownMenuItem onClick={onOptOut} disabled={loading}>
						<UserMinus className="h-4 w-4 mr-2" /> {t('action_mark_as_opt_out')}
					</DropdownMenuItem>
				)}
				{!contact.concentMessageSent && !contact.contactConsent && !contact.concentMessageFailed && contact.phone && (
					<DropdownMenuItem onClick={onSendConsent} disabled={loading}>
						<MessageSquare className="h-4 w-4 mr-2" /> {t('action_send_consent')}
					</DropdownMenuItem>
				)}
				{((contact.concentMessageSent && !contact.contactConsent) || contact.concentMessageFailed) && (
					<DropdownMenuItem onClick={onResetConsent} disabled={loading}>
						<RotateCcw className="h-4 w-4 mr-2" /> {t('action_reset_consent')}
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={contact.approved ? onUnapprove : onApprove} disabled={loading}>
					{contact.approved ? (
						<>
							<XCircle className="h-4 w-4 mr-2 text-rose-500" /> {t('not_approved')}
						</>
					) : (
						<>
							<CheckCircle className="h-4 w-4 mr-2 text-emerald-500" /> {t('approved')}
						</>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const StatusDropdown = ({ 
	contact, 
	currentStatus 
}: { 
	contact: any; 
	currentStatus: ConsentStatus 
}) => {
	const t = useTranslations('super.contacts.contacts_list.consent_status');
	const [isLoading, setIsLoading] = useState(false);

	const handleStatusChange = async (newStatus: ConsentStatus) => {
		if (newStatus === currentStatus) return;
		
		setIsLoading(true);
		try {
			await updateContactStatusAction(contact.id, newStatus);
		} catch (error) {
			console.error('Error updating status:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const statusOptions = [
		{ value: 'concent_message_not_sent', label: t('concent_message_not_sent') },
		{ value: 'no_response', label: t('no_response') },
		{ value: 'gave_consent', label: t('gave_consent') },
		{ value: 'declined', label: t('declined') },
		{ value: 'concent_message_failed', label: t('concent_message_failed') },
	] as const;

	return (
		<Select
			value={currentStatus}
			onValueChange={handleStatusChange}
			disabled={isLoading}
		>
			<SelectTrigger className="w-[200px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{statusOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						<div className="flex items-center gap-2">
							<ConsentBadge status={option.value} />
							<span>{option.label}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

const ContactsTable = ({
	contacts,
	searchParams,
}: {
	contacts: any[];
	searchParams?: ContactSearchParams;
}) => {
	const t = useTranslations('super.contacts.contacts_list');
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="rounded-lg border bg-card">
			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className="bg-muted/50">
							<TableCell className="font-semibold">{t('contact_title')}</TableCell>
							<TableCell className="font-semibold">{t('first_name')}</TableCell>
							<TableCell className="font-semibold">{t('middle_name')}</TableCell>
							<TableCell className="font-semibold">{t('family_name')}</TableCell>
							<TableCell className="font-semibold">{t('previous_family_name')}</TableCell>
							<TableCell className="font-semibold">{t('phone')}</TableCell>
							<TableCell className="font-semibold">{t('village')}</TableCell>
							<TableCell className="hidden md:table-cell font-semibold">
								{t('personal_number')}
							</TableCell>
							<TableCell className="hidden md:table-cell font-semibold">{t('home_number')}</TableCell>
							<TableCell className="hidden md:table-cell font-semibold">{t('hood')}</TableCell>
							<TableCell className="font-semibold">{t('admin_approval')}</TableCell>
							<TableCell className="font-semibold">{t('consent')}</TableCell>
							<TableCell className="w-[120px] font-semibold text-center">{t('actions')}</TableCell>
						</TableRow>
						<TableRow className="bg-muted/25">
							<TableCell className="p-2">
								<SearchInput
									paramName="title"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="firstName"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="middleName"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="family"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="previousFamilyName"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="phone"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2">
								<SearchInput
									paramName="town"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="hidden p-2 md:table-cell">
								<SearchInput
									paramName="personalNumber"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="hidden p-2 md:table-cell">
								<SearchInput
									paramName="home"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="hidden p-2 md:table-cell">
								<SearchInput
									paramName="street"
									placeholder="بحث..."
									className="w-full h-8"
								/>
							</TableCell>
							<TableCell className="p-2"></TableCell>
							<TableCell className="p-2"></TableCell>
							<TableCell className="p-2"></TableCell>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contacts.map((contact) => (
							<TableRow key={contact.id} className="hover:bg-muted/25">
								<TableCell>{contact.title || '-'}</TableCell>
								<TableCell className="font-medium">{contact.firstName}</TableCell>
								<TableCell>{contact.middleName || '-'}</TableCell>
								<TableCell>{contact.family?.name || '-'}</TableCell>
								<TableCell>{contact.previousFamilyName || '-'}</TableCell>
								<TableCell className="font-mono text-sm">{contact.phone || '-'}</TableCell>
								<TableCell>{contact.household?.town || '-'}</TableCell>
								<TableCell className="hidden md:table-cell font-mono text-sm">
									{contact.personalNumber || '-'}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{contact.household?.number || '-'}
								</TableCell>
								<TableCell className="hidden md:table-cell">
									{contact.household?.street || '-'}
								</TableCell>
								<TableCell>
									<AdminApprovalBadge approved={contact.approved} />
								</TableCell>
								<TableCell>
									<StatusDropdown contact={contact} currentStatus={getConsentStatus(contact)} />
								</TableCell>
								<TableCell className="text-center">
									<ContactActionsDropdown
										contact={contact}
										loading={isLoading}
										onEdit={() => router.push(`/super/contacts/${contact.id}/edit`)}
										onDelete={async () => {
											await deleteContactAction(contact.id);
										}}
										onOptOut={async () => {
											await markContactAsOptOutAction(contact.id);
										}}
										onSendConsent={async () => {
											await sendConcentMessageAction(contact.id);
										}}
										onResetConsent={async () => {
											await resetConcentStatusAction(contact.id);
										}}
										onApprove={async () => {
											await approveContactAction(contact.id);
										}}
										onUnapprove={async () => {
											await unapproveContactAction(contact.id);
										}}
									/>
								</TableCell>
							</TableRow>
						))}
						{contacts.length === 0 && (
							<TableRow>
								<TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
									لا توجد جهات اتصال متطابقة مع المرشحات المحددة
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

function SendAllConsentButton({
	contacts,
	t,
}: {
	contacts: any[];
	t: ReturnType<typeof useTranslations>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [done, setDone] = useState(false);

	const eligibleContacts = contacts.filter(
		(contact) =>
			!contact.contactConsent &&
			!contact.optOut &&
			contact.phone &&
			!contact.concentMessageSent &&
			!contact.concentMessageFailed
	);

	const handleSendAll = async () => {
		setIsLoading(true);
		for (const contact of eligibleContacts) {
			try {
				await sendConcentMessageAction(contact.id);
			} catch (e) {
				// ignore individual errors
			}
		}
		setIsLoading(false);
		setDone(true);
		setTimeout(() => setDone(false), 3000);
	};

	return (
		<Button
			onClick={handleSendAll}
			disabled={isLoading || eligibleContacts.length === 0}
			variant="outline"
			size="sm"
			className="flex items-center gap-2"
		>
			<MessageSquare className="h-4 w-4" />
			{isLoading
				? t('sending_all')
				: done
					? t('sent_all')
					: t('send_consent_to_all') + ` (${eligibleContacts.length})`}
		</Button>
	);
}

function BulkApprovalButton({
	searchParams,
	t,
}: {
	searchParams?: ContactSearchParams;
	t: ReturnType<typeof useTranslations>;
}) {
	const [isApproving, setIsApproving] = useState(false);
	const [isUnapproving, setIsUnapproving] = useState(false);
	const [approveDone, setApproveDone] = useState(false);
	const [unapproveDone, setUnapproveDone] = useState(false);

	const handleApproveAll = async () => {
		setIsApproving(true);
		try {
			const result = await bulkApproveContactsAction(searchParams);
			if (result.success) {
				setApproveDone(true);
				setTimeout(() => setApproveDone(false), 3000);
			}
		} catch (error) {
			console.error('Error bulk approving:', error);
		} finally {
			setIsApproving(false);
		}
	};

	const handleUnapproveAll = async () => {
		setIsUnapproving(true);
		try {
			const result = await bulkUnapproveContactsAction(searchParams);
			if (result.success) {
				setUnapproveDone(true);
				setTimeout(() => setUnapproveDone(false), 3000);
			}
		} catch (error) {
			console.error('Error bulk unapproving:', error);
		} finally {
			setIsUnapproving(false);
		}
	};

	return (
		<div className="flex gap-2">
			<Button
				onClick={handleApproveAll}
				disabled={isApproving || isUnapproving}
				variant="outline"
				size="sm"
				className="flex items-center gap-2"
			>
				<CheckCircle className="h-4 w-4 text-emerald-500" />
				{isApproving
					? 'جاري اعتماد الكل...'
					: approveDone
						? 'تم اعتماد الكل'
						: 'اعتماد الكل'}
			</Button>
			
			<Button
				onClick={handleUnapproveAll}
				disabled={isApproving || isUnapproving}
				variant="outline"
				size="sm"
				className="flex items-center gap-2"
			>
				<XCircle className="h-4 w-4 text-rose-500" />
				{isUnapproving
					? 'جاري إلغاء اعتماد الكل...'
					: unapproveDone
						? 'تم إلغاء اعتماد الكل'
						: 'إلغاء اعتماد الكل'}
			</Button>
		</div>
	);
}

export function ContactsList({
	contacts,
	towns,
	streets,
	families,
	stats,
	totalPages,
	totalContacts,
	searchParams,
}: ContactsListProps) {
	const t = useTranslations('super.contacts.contacts_list');
	const { user } = useAuth();

	return (
		<div className="space-y-6">
			{/* Stats Section */}
			<StatsSection stats={stats} t={t} />

			{/* Filters Section */}
			<FiltersSection
				towns={towns}
				streets={streets}
				families={families}
				searchParams={searchParams}
				t={t}
			/>

			{/* Main Content */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="text-xl">{t('contacts_list')}</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							عرض {contacts.length} من أصل {totalContacts} جهة اتصال
						</p>
					</div>

					{user?.is_super_admin && (
						<div className="flex gap-2">
							<SendAllConsentButton contacts={contacts} t={t} />
							<BulkApprovalButton searchParams={searchParams} t={t} />
						</div>
					)}
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Top Pagination */}
					<ContactsPagination 
						currentPage={searchParams?.page ? parseInt(searchParams.page) : 1} 
						totalPages={totalPages} 
					/>

					<Separator />

					{/* Table */}
					<ContactsTable
						contacts={contacts}
						searchParams={searchParams}
					/>

					<Separator />

					{/* Bottom Pagination */}
					<ContactsPagination 
						currentPage={searchParams?.page ? parseInt(searchParams.page) : 1} 
						totalPages={totalPages} 
					/>
				</CardContent>
			</Card>
		</div>
	);
}
