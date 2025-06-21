'use client';

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	Loader2,
	LogOut,
	Moon,
	Sparkles,
	Sun,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/providers/auth-provider';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function NavUser({ isRTL = false }: { isRTL?: boolean }) {
	const { isMobile } = useSidebar();
	const { theme, setTheme } = useTheme();
	const { user, logoutUser, refreshUser } = useAuth();
	const t = useTranslations("super.sidebar.user_controls");

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{!user ? (
								<Loader2 className="h-8 w-8 rounded-lg" />
							) : (
								<>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={user?.photo_url || ''}
											alt={user?.username || ''}
										/>
										<AvatarFallback className="rounded-lg">CN</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{user?.username || ''}
										</span>
										<span className="truncate text-xs">
											{user?.email || ''}
										</span>
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</>
							)}
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user?.photo_url || ''}
										alt={user?.username || ''}
									/>
									<AvatarFallback className="rounded-lg">CN</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{user?.username || ''}
									</span>
									<span className="truncate text-xs">{user?.email || ''}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								{t('upgradetopro')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								{t('account')}
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								{t('billing')}
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								{t('notifications')}
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
							>
								{theme === 'light' ? <Moon /> : <Sun />}
								{theme === 'light'
									? t('darkmode')
									: t('lightmode')}
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={logoutUser}>
							<LogOut />
							{t('logout')}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
