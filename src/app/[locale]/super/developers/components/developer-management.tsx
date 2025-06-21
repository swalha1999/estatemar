'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useActionState } from "@/hooks/use-action-state";
import { createDeveloperAction, updateDeveloperAction, deleteDeveloperAction, getDevelopersAction } from '../actions';
import { type DeveloperInterface } from '@/data/access-layer-v2/interfaces/developer.interface';

export function DeveloperManagement() {
	const t = useTranslations('super.developers');
	const locale = useLocale();
	const { toast } = useToast();
	const [developers, setDevelopers] = useState<DeveloperInterface[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingDeveloper, setEditingDeveloper] = useState<DeveloperInterface | null>(null);
	const [deletingDeveloper, setDeletingDeveloper] = useState<DeveloperInterface | null>(null);

	// Determine text direction based on locale
	const isRTL = locale === 'ar' || locale === 'he';
	const textDirection = isRTL ? 'rtl' : 'ltr';

	// Form states
	const [createState, createAction, isCreating] = useActionState(createDeveloperAction, { success: false, message: '' });
	const [updateState, updateAction, isUpdating] = useActionState(updateDeveloperAction, { success: false, message: '' });

	// Load developers on component mount
	useEffect(() => {
		loadDevelopers();
	}, []);

	// Handle create/update responses
	useEffect(() => {
		if (createState.success) {
			toast({
				title: t('table.toast.success'),
				description: t('table.toast.developer_created'),
			});
			setIsCreateDialogOpen(false);
			loadDevelopers();
		} else if (createState.message) {
			toast({
				title: t('table.toast.error'),
				description: createState.message,
				variant: 'destructive',
			});
		}
	}, [createState, t, toast]);

	useEffect(() => {
		if (updateState.success) {
			toast({
				title: t('table.toast.success'),
				description: t('table.toast.developer_updated'),
			});
			setEditingDeveloper(null);
			loadDevelopers();
		} else if (updateState.message) {
			toast({
				title: t('table.toast.error'),
				description: updateState.message,
				variant: 'destructive',
			});
		}
	}, [updateState, t, toast]);

	const loadDevelopers = async () => {
		try {
			setLoading(true);
			const result = await getDevelopersAction();
			if (result.success) {
				setDevelopers(result.data);
			} else {
				toast({
					title: t('table.toast.error'),
					description: result.message || t('table.toast.error_message'),
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: t('table.toast.error'),
				description: t('table.toast.error_message'),
				variant: 'destructive',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (developer: DeveloperInterface) => {
		try {
			const result = await deleteDeveloperAction(developer.id);
			if (result.success) {
				toast({
					title: t('table.toast.success'),
					description: t('table.toast.developer_deleted'),
				});
				loadDevelopers();
			} else {
				toast({
					title: t('table.toast.error'),
					description: result.message || t('table.toast.error_message'),
					variant: 'destructive',
				});
			}
		} catch (error) {
			toast({
				title: t('table.toast.error'),
				description: t('table.toast.error_message'),
				variant: 'destructive',
			});
		}
		setDeletingDeveloper(null);
	};

	const filteredDevelopers = developers.filter(developer =>
		developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		developer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		(developer.companyInfo && developer.companyInfo.toLowerCase().includes(searchTerm.toLowerCase()))
	);

	return (
		<div className="space-y-6" dir={textDirection}>
			{/* Header Actions */}
			<div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
				<div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
					<div className="relative">
						<Search className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
						<Input
							placeholder={t('table.search_placeholder') || "Search developers..."}
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 max-w-sm ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
						/>
					</div>
				</div>
				<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
					<DialogTrigger asChild>
						<Button className={`bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}>
							<Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
							{t('page.create_developer')}
						</Button>
					</DialogTrigger>
					<DialogContent className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full mx-4" dir={textDirection}>
						<div className="px-6 py-4 border-b border-gray-200">
							<DialogTitle className="text-xl font-semibold text-gray-700 mb-4">{t('create_developer_dialog.title')}</DialogTitle>
						</div>
						<form action={createAction} className="px-6 py-6 space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="text-xs font-medium text-gray-700 block">{t('create_developer_dialog.name')}</Label>
								<Input
									id="name"
									name="name"
									placeholder={t('create_developer_dialog.name_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-xs font-medium text-gray-700 block">{t('create_developer_dialog.email')}</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder={t('create_developer_dialog.email_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone" className="text-xs font-medium text-gray-700 block">{t('create_developer_dialog.phone')}</Label>
								<Input
									id="phone"
									name="phone"
									placeholder={t('create_developer_dialog.phone_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="companyInfo" className="text-xs font-medium text-gray-700 block">{t('create_developer_dialog.company_info')}</Label>
								<Textarea
									id="companyInfo"
									name="companyInfo"
									placeholder={t('create_developer_dialog.company_info_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 min-h-20"
									rows={3}
								/>
							</div>
							<div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
								<Button 
									type="button" 
									variant="outline" 
									onClick={() => setIsCreateDialogOpen(false)}
									className="bg-secondary text-secondary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-secondary/80 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 border border-gray-200"
								>
									{t('create_developer_dialog.cancel')}
								</Button>
								<Button 
									type="submit" 
									disabled={isCreating}
									className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
								>
									{isCreating ? t('create_developer_dialog.creating') : t('create_developer_dialog.create')}
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
			</div>

			{/* Developers Table */}
			<div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 dark:bg-gray-900 dark:border-gray-800 overflow-hidden">
				<Table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
					<TableHeader>
						<TableRow>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200">{t('table.name')}</TableHead>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200">{t('table.email')}</TableHead>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200">{t('table.phone')}</TableHead>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200">{t('table.company_info')}</TableHead>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200">{t('table.created_at')}</TableHead>
							<TableHead className="bg-gray-50 text-gray-700 text-xs font-medium text-left px-6 py-4 border-b border-gray-200 w-[100px]">{t('table.actions')}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{loading ? (
							<TableRow className="hover:bg-gray-50 transition-colors duration-150">
								<TableCell colSpan={6} className="text-sm text-gray-900 px-6 py-4 border-b border-gray-100 last:border-b-0 text-center py-12 text-gray-500">
									<div className="flex items-center justify-center space-x-2">
										<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
										<span>Loading...</span>
									</div>
								</TableCell>
							</TableRow>
						) : filteredDevelopers.length === 0 ? (
							<TableRow className="hover:bg-gray-50 transition-colors duration-150">
								<TableCell colSpan={6} className="text-sm text-gray-900 px-6 py-4 border-b border-gray-100 last:border-b-0 text-center py-12 text-gray-500">
									{t('table.no_developers')}
								</TableCell>
							</TableRow>
						) : (
							filteredDevelopers.map((developer) => (
								<TableRow key={developer.id} className="hover:bg-gray-50 transition-colors duration-150">
									<TableCell className="text-sm text-gray-900 px-6 py-4 border-b border-gray-100 last:border-b-0 font-medium text-gray-900">{developer.name}</TableCell>
									<TableCell className="text-sm text-gray-600 px-6 py-4 border-b border-gray-100 last:border-b-0">{developer.email}</TableCell>
									<TableCell className="text-sm text-gray-600 px-6 py-4 border-b border-gray-100 last:border-b-0">{developer.phone || '-'}</TableCell>
									<TableCell className="text-sm text-gray-600 px-6 py-4 border-b border-gray-100 last:border-b-0 max-w-xs truncate">{developer.companyInfo || '-'}</TableCell>
									<TableCell className="text-sm text-gray-600 px-6 py-4 border-b border-gray-100 last:border-b-0">
										{developer.createdAt ? new Date(developer.createdAt).toLocaleDateString(locale) : '-'}
									</TableCell>
									<TableCell className="text-sm text-gray-900 px-6 py-4 border-b border-gray-100 last:border-b-0">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align={isRTL ? "start" : "end"} className="bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48">
												<DropdownMenuItem 
													onClick={() => setEditingDeveloper(developer)}
													className="text-sm px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-150"
												>
													<Edit className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
													{t('table.edit_developer')}
												</DropdownMenuItem>
												<DropdownMenuItem 
													onClick={() => setDeletingDeveloper(developer)}
													className="text-sm px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-150"
												>
													<Trash2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
													{t('table.delete_developer')}
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Edit Developer Dialog */}
			<Dialog open={!!editingDeveloper} onOpenChange={() => setEditingDeveloper(null)}>
				<DialogContent className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full mx-4" dir={textDirection}>
					<div className="px-6 py-4 border-b border-gray-200">
						<DialogTitle className="text-xl font-semibold text-gray-700 mb-4">{t('edit_developer_dialog.title')}</DialogTitle>
					</div>
					{editingDeveloper && (
						<form action={updateAction} className="px-6 py-6 space-y-4">
							<input type="hidden" name="id" value={editingDeveloper.id} />
							<div className="space-y-2">
								<Label htmlFor="edit-name" className="text-xs font-medium text-gray-700 block">{t('edit_developer_dialog.name')}</Label>
								<Input
									id="edit-name"
									name="name"
									defaultValue={editingDeveloper.name}
									placeholder={t('edit_developer_dialog.name_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-email" className="text-xs font-medium text-gray-700 block">{t('edit_developer_dialog.email')}</Label>
								<Input
									id="edit-email"
									name="email"
									type="email"
									defaultValue={editingDeveloper.email}
									placeholder={t('edit_developer_dialog.email_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-phone" className="text-xs font-medium text-gray-700 block">{t('edit_developer_dialog.phone')}</Label>
								<Input
									id="edit-phone"
									name="phone"
									defaultValue={editingDeveloper.phone || ''}
									placeholder={t('edit_developer_dialog.phone_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="edit-companyInfo" className="text-xs font-medium text-gray-700 block">{t('edit_developer_dialog.company_info')}</Label>
								<Textarea
									id="edit-companyInfo"
									name="companyInfo"
									defaultValue={editingDeveloper.companyInfo || ''}
									placeholder={t('edit_developer_dialog.company_info_placeholder')}
									className="text-sm w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-gray-400 min-h-20"
									rows={3}
								/>
							</div>
							<div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
								<Button 
									type="button" 
									variant="outline" 
									onClick={() => setEditingDeveloper(null)}
									className="bg-secondary text-secondary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-secondary/80 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 border border-gray-200"
								>
									{t('edit_developer_dialog.cancel')}
								</Button>
								<Button 
									type="submit" 
									disabled={isUpdating}
									className="bg-primary text-primary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
								>
									{isUpdating ? t('edit_developer_dialog.updating') : t('edit_developer_dialog.update')}
								</Button>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={!!deletingDeveloper} onOpenChange={() => setDeletingDeveloper(null)}>
				<AlertDialogContent className="bg-white rounded-xl shadow-xl border border-gray-200 max-w-lg w-full mx-4" dir={textDirection}>
					<div className="px-6 py-4 border-b border-gray-200">
						<AlertDialogTitle className="text-xl font-semibold text-red-600 mb-4">{t('delete_developer_dialog.title')}</AlertDialogTitle>
						<AlertDialogDescription className="text-sm text-gray-600 mt-2">
							{deletingDeveloper && 
								t('delete_developer_dialog.description', { name: deletingDeveloper.name })
							}
						</AlertDialogDescription>
					</div>
					<div className={`px-6 py-4 border-t border-gray-200 flex justify-end gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
						<AlertDialogCancel className="bg-secondary text-secondary-foreground text-sm font-semibold px-6 py-3 rounded-lg hover:bg-secondary/80 focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 transition-all duration-200 border border-gray-200">
							{t('delete_developer_dialog.cancel')}
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deletingDeveloper && handleDelete(deletingDeveloper)}
							className="bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 text-sm font-semibold px-6 py-3 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
						>
							{t('delete_developer_dialog.delete')}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
} 