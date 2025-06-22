'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
	Key, 
	Lock, 
	LogIn, 
	MoreVertical, 
	Shield, 
	ShieldCheck, 
	ShieldX, 
	Trash2, 
	User as UserIcon, 
	UserCheck, 
	UserX,
	Edit
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toggleAdminAction, toggleSuperAdminAction, loginAsUserAction } from './actions';
import { ChangePasswordDialog } from './change-password-dialog';
import { ChangeUsernameDialog } from './change-username-dialog';
import { DeleteUserDialog } from './delete-user-dialog';
import { UserInterface } from '@/data/access-layer-v2/interfaces/user.interface';

interface UsersTableProps {
	users: UserInterface[];
	currentUser: UserInterface;
}

const UserActionsDropdown = ({ 
	user, 
	currentUser, 
	onChangePassword, 
	onChangeUsername,
	onDeleteUser, 
	loading 
}: {
	user: UserInterface;
	currentUser: UserInterface;
	onChangePassword: () => void;
	onChangeUsername: () => void;
	onDeleteUser: () => void;
	loading: boolean;
}) => {
	const t = useTranslations('super.users');
	const { toast } = useToast();
	const router = useRouter();

	const handleToggleAdmin = async () => {
		const result = await toggleAdminAction(user.id);
		if (result.is_success) {
			toast({
				title: t('table.toast.success'),
				description: t('table.toast.admin_toggled'),
			});
			router.refresh();
		} else {
			toast({
				title: t('table.toast.error'),
				description: t('table.toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const handleToggleSuperAdmin = async () => {
		const result = await toggleSuperAdminAction(user.id);
		if (result.is_success) {
			toast({
				title: t('table.toast.success'),
				description: t('table.toast.super_admin_toggled'),
			});
			router.refresh();
		} else {
			toast({
				title: t('table.toast.error'),
				description: t('table.toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const handleLoginAsUser = async () => {
		const result = await loginAsUserAction(user.id);
		if (result.is_success) {
			toast({
				title: t('table.toast.success'),
				description: t('table.toast.login_as_user'),
			});
			router.refresh();
		} else {
			toast({
				title: t('table.toast.error'),
				description: t('table.toast.error_message'),
				variant: 'destructive',
			});
		}
	};

	const isCurrentUser = user.id === currentUser.id;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" disabled={loading} aria-label={t('table.actions')}>
					<MoreVertical className="w-4 h-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{currentUser.is_super_admin && (
					<>
						<DropdownMenuItem onClick={handleToggleAdmin} disabled={loading || isCurrentUser}>
							{user.is_admin ? (
								<>
									<UserX className="h-4 w-4 mr-2" /> {t('table.remove_admin')}
								</>
							) : (
								<>
									<UserCheck className="h-4 w-4 mr-2" /> {t('table.make_admin')}
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleToggleSuperAdmin} disabled={loading || isCurrentUser}>
							{user.is_super_admin ? (
								<>
									<ShieldX className="h-4 w-4 mr-2" /> {t('table.remove_super_admin')}
								</>
							) : (
								<>
									<ShieldCheck className="h-4 w-4 mr-2" /> {t('table.make_super_admin')}
								</>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handleLoginAsUser} disabled={loading || isCurrentUser}>
							<LogIn className="h-4 w-4 mr-2" /> {t('table.login_as_user')}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onChangeUsername} disabled={loading}>
							<Edit className="h-4 w-4 mr-2" /> {t('table.change_username')}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onChangePassword} disabled={loading}>
							<Key className="h-4 w-4 mr-2" /> {t('table.change_password')}
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDeleteUser} disabled={loading || isCurrentUser}>
							<Trash2 className="h-4 w-4 mr-2" /> {t('table.delete_user')}
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export function UsersTable({ users, currentUser }: UsersTableProps) {
	const t = useTranslations('super.users');
	const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
	const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<{ id: number; username: string } | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState<{ id: number; username: string } | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChangePassword = (userId: number, username: string) => {
		setSelectedUser({ id: userId, username });
		setPasswordDialogOpen(true);
	};

	const handleChangeUsername = (userId: number, username: string) => {
		setSelectedUser({ id: userId, username });
		setUsernameDialogOpen(true);
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
						<TableCell>{t('table.username')}</TableCell>
						<TableCell>{t('table.email')}</TableCell>
						<TableCell>{t('table.roles')}</TableCell>
						<TableCell className="w-[120px] text-center">{t('table.actions')}</TableCell>
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
										<Badge variant="destructive">{t('table.super_admin')}</Badge>
									)}
									{user.is_admin && <Badge variant="secondary">{t('table.admin')}</Badge>}
								</div>
							</TableCell>
							<TableCell className="text-center">
								<UserActionsDropdown
									user={user}
									currentUser={currentUser}
									loading={isLoading}
									onChangePassword={() => handleChangePassword(user.id, user.username)}
									onChangeUsername={() => handleChangeUsername(user.id, user.username)}
									onDeleteUser={() => handleDeleteUser(user.id, user.username)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			
			{selectedUser && (
				<>
					<ChangePasswordDialog
						userId={selectedUser.id}
						username={selectedUser.username}
						open={passwordDialogOpen}
						onOpenChange={setPasswordDialogOpen}
					/>
					<ChangeUsernameDialog
						userId={selectedUser.id}
						currentUsername={selectedUser.username}
						open={usernameDialogOpen}
						onOpenChange={setUsernameDialogOpen}
					/>
				</>
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
