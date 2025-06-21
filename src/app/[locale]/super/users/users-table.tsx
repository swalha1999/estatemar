'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/db/schema-auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
	MoreHorizontal, 
	Shield, 
	ShieldCheck, 
	LogIn, 
	Key, 
	Trash2 
} from 'lucide-react';
import { toggleAdminAction, toggleSuperAdminAction, loginAsUserAction } from './actions';
import { ChangePasswordDialog } from './change-password-dialog';
import { DeleteUserDialog } from './delete-user-dialog';

interface UsersTableProps {
	users: User[];
	currentUser: User;
}

export function UsersTable({ users, currentUser }: UsersTableProps) {
	const t = useTranslations('super.users.table');
	const { toast } = useToast();
	const router = useRouter();
	
	// Dialog state management
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);

	// Action handlers
	const handleToggleAdmin = async (userId: number) => {
		const result = await toggleAdminAction(userId);
		if (result.is_success) {
			toast({
				title: t('toast.success'),
				description: t('toast.admin_toggled'),
			});
			router.refresh();
		} else {
			toast({
				title: t('toast.error'),
				description: t('toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const handleToggleSuperAdmin = async (userId: number) => {
		const result = await toggleSuperAdminAction(userId);
		if (result.is_success) {
			toast({
				title: t('toast.success'),
				description: t('toast.super_admin_toggled'),
			});
			router.refresh();
		} else {
			toast({
				title: t('toast.error'),
				description: t('toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const handleLoginAsUser = async (userId: number) => {
		const result = await loginAsUserAction(userId);
		if (result.is_success) {
			toast({
				title: t('toast.success'),
				description: t('toast.login_as_user'),
			});
			router.refresh();
		} else {
			toast({
				title: t('toast.error'),
				description: t('toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const handleChangePassword = (userId: number, username: string) => {
		setSelectedUser({ id: userId, username });
		setPasswordDialogOpen(true);
	};

	const handleDeleteUser = (userId: number, username: string) => {
		setUserToDelete({ id: userId, username });
		setDeleteDialogOpen(true);
	};

	// Helper function to render user roles
	const renderUserRoles = (user: User) => (
		<div className="flex gap-2">
			{user.is_super_admin && (
				<Badge variant="destructive">{t('super_admin')}</Badge>
			)}
			{user.is_admin && <Badge variant="secondary">{t('admin')}</Badge>}
		</div>
	);

	// Helper function to render actions dropdown
	const renderActionsDropdown = (user: User) => {
		if (!currentUser.is_super_admin) return null;

		const isCurrentUser = user.id === currentUser.id;

		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
						<MoreHorizontal className="h-4 w-4" />
						<span className="sr-only">Open menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => handleToggleAdmin(user.id)}
						disabled={isCurrentUser}
					>
						<Shield className="mr-2 h-4 w-4" />
						{user.is_admin ? t('remove_admin') : t('make_admin')}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleToggleSuperAdmin(user.id)}
						disabled={isCurrentUser}
					>
						<ShieldCheck className="mr-2 h-4 w-4" />
						{user.is_super_admin
							? t('remove_super_admin')
							: t('make_super_admin')}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleLoginAsUser(user.id)}
						disabled={isCurrentUser}
					>
						<LogIn className="mr-2 h-4 w-4" />
						{t('login_as_user')}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleChangePassword(user.id, user.username)}
					>
						<Key className="mr-2 h-4 w-4" />
						{t('change_password')}
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => handleDeleteUser(user.id, user.username)}
						disabled={isCurrentUser}
						className="text-destructive focus:text-destructive"
					>
						<Trash2 className="mr-2 h-4 w-4" />
						{t('delete_user')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	};

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>{t('username')}</TableCell>
						<TableCell>{t('email')}</TableCell>
						<TableCell>{t('roles')}</TableCell>
						<TableCell>{t('actions')}</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>{renderUserRoles(user)}</TableCell>
							<TableCell>{renderActionsDropdown(user)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			
			{/* Dialogs */}
			{selectedUser && (
				<ChangePasswordDialog
					userId={selectedUser.id}
					username={selectedUser.username}
					open={passwordDialogOpen}
					onOpenChange={setPasswordDialogOpen}
				/>
			)}

			{userToDelete && (
				<DeleteUserDialog
					userId={userToDelete.id}
					username={userToDelete.username}
					open={deleteDialogOpen}
					onOpenChange={setDeleteDialogOpen}
				/>
			)}
		</>
	);
}
