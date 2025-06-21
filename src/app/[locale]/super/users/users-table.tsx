'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/db/schema-auth';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toggleAdminAction, toggleSuperAdminAction, loginAsUserAction } from './actions';
import { ChangePasswordDialog } from './change-password-dialog';
import { DeleteUserDialog } from './delete-user-dialog';

interface UsersTableProps {
	users: User[];
	currentUser: User;
}

export function UsersTable({ users, currentUser }: UsersTableProps) {
	const t = useTranslations('super.users');
	const { toast } = useToast();
	const router = useRouter();
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);


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
							<TableCell>
								<div className="flex gap-2">
									{user.is_super_admin && (
										<Badge variant="destructive">{t('super_admin')}</Badge>
									)}
									{user.is_admin && <Badge variant="secondary">{t('admin')}</Badge>}
								</div>
							</TableCell>
							<TableCell>
								<div className="flex gap-2 flex-wrap">
									{currentUser.is_super_admin && (
										<>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleToggleAdmin(user.id)}
												disabled={user.id === currentUser.id}
											>
												{user.is_admin ? t('remove_admin') : t('make_admin')}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleToggleSuperAdmin(user.id)}
												disabled={user.id === currentUser.id}
											>
												{user.is_super_admin
													? t('remove_super_admin')
													: t('make_super_admin')}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleLoginAsUser(user.id)}
												disabled={user.id === currentUser.id}
											>
												{t('login_as_user')}
											</Button>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleChangePassword(user.id, user.username)}
											>
												{t('change_password')}
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDeleteUser(user.id, user.username)}
												disabled={user.id === currentUser.id}
											>
												{t('delete_user')}
											</Button>
										</>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			
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
