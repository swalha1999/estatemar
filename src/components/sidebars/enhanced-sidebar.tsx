'use client';

import { useRef, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { User, Users, History, LogOut, SunMoon, Menu, Mail, Home, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function EnhancedSidebar() {
	const t = useTranslations();
	const { theme, setTheme } = useTheme();
	const { user, logoutUser } = useAuth();
	const sidebarRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();
	const isMobile = useIsMobile();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(true);
	const isInitialMount = useRef(true);

	useEffect(() => {
		// After initial mount, set signing in to false
		if (isInitialMount.current) {
			isInitialMount.current = false;
			// Small delay to allow the initial animation to complete
			setTimeout(() => {
				setIsSigningIn(false);
			}, 1000);
		}
	}, []);

	const handleLogout = async () => {
		// First trigger the animation
		setIsLoggingOut(true);
		const logoElement = document.querySelector('[data-logo]');
		if (logoElement) {
			logoElement.classList.add('animate-out');
		}

		// Wait for animation to complete
		await new Promise((resolve) => setTimeout(resolve, 500));

		// Then logout and navigate
		await logoutUser();
		router.push('/login');
	};

	const getUserInitials = (username?: string) => {
		if (!username) return 'U';
		return username.slice(0, 2).toUpperCase();
	};

	const SidebarContent = () => (
		<>
			{/* Logo Section with Decorative Elements */}
			<div className="islamic-pattern relative overflow-hidden p-6">
				{/* Decorative floating elements */}
				<div className="float-animation absolute right-2 top-2 text-lg text-amber-400/40">
					🌟
				</div>
				<div
					className="float-animation absolute left-4 top-10 text-lg text-rose-400/40"
					style={{ animationDelay: '2s' }}
				>
					💐
				</div>
				<div
					className="float-animation absolute right-10 bottom-4 text-lg text-amber-500/40"
					style={{ animationDelay: '4s' }}
				>
					✨
				</div>
				
				<div className="flex items-center justify-center">
					<div className="relative h-20 w-20">
						<motion.div
							data-logo
							layoutId={isLoggingOut || isSigningIn ? 'logo' : undefined}
							initial={{ scale: 1 }}
							animate={{ scale: 1 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 30,
								opacity: { duration: 0.2 },
							}}
							className="relative h-full w-full"
						>
							<Image
								src="/static/fav_1.svg"
								alt="عزيمة Logo"
								fill
								className="object-contain"
								priority
							/>
						</motion.div>
					</div>
				</div>
				
				{/* App Name */}
				<div className="mt-4 text-center">
					<h1 className="bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-xl font-bold text-transparent">
						عزيمة
					</h1>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						{t('user.sidebar.tagline') || 'Digital Invitations'}
					</p>
				</div>
			</div>

			<Separator className="mx-auto w-[90%] bg-gray-200 dark:bg-gray-700" />

			{/* User Profile Section */}
			<div className="warm-card dark:warm-card-dark mx-4 my-4 overflow-hidden rounded-xl p-4">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Avatar className="warm-shadow-lg h-12 w-12 border-2 border-white/80">
							<AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-white">
								{getUserInitials(user?.username)}
							</AvatarFallback>
						</Avatar>
					</div>
					<div>
						<p className="font-medium text-gray-800 dark:text-gray-200">
							{user?.username || ''}
						</p>
					</div>
				</div>
			</div>

			{/* Main Navigation */}
			<div className="mt-2 flex-1 space-y-1 px-3">
				<NavItem
					href="/dashboard"
					icon={<Home className="h-5 w-5" />}
					label={t('user.sidebar.dashboard') || 'Dashboard'}
					isActive={pathname === '/dashboard'}
					onClick={() => isMobile && setIsOpen(false)}
				/>

				<NavItem
					href="/dashboard/contacts"
					icon={<Users className="h-5 w-5" />}
					label={t('user.sidebar.contacts') || 'Contacts'}
					isActive={pathname === '/dashboard/contacts'}
					onClick={() => isMobile && setIsOpen(false)}
				/>

				<NavItem
					href="/dashboard/my-contacts"
					icon={<UserPlus className="h-5 w-5" />}
					label={t('user.sidebar.my_contacts') || 'My Contacts'}
					isActive={pathname.includes('/dashboard/my-contacts')}
					onClick={() => isMobile && setIsOpen(false)}
				/>

				<NavItem
					href="/dashboard/invitations"
					icon={<Mail className="h-5 w-5" />}
					label={t('user.sidebar.invitations') || 'Invitations'}
					isActive={pathname.includes('/dashboard/invitations')}
					onClick={() => isMobile && setIsOpen(false)}
				/>
			</div>

			{/* Footer with Settings */}
			<div className="mt-auto p-4">
				<Separator className="mb-4 w-full bg-gray-200 dark:bg-gray-700" />

				<div className="flex items-center justify-between">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
						className="warm-shadow h-10 w-10 rounded-xl border-2 border-gray-200 transition-all duration-300 dark:border-gray-700"
					>
						<SunMoon className="h-5 w-5 text-primary" />
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={handleLogout}
						className="warm-shadow rounded-xl border-2 border-gray-200 px-4 text-destructive transition-all duration-300 hover:border-destructive hover:bg-destructive/10 hover:text-destructive dark:border-gray-700"
					>
						<LogOut className="mr-2 h-4 w-4" />
						{t('user.sidebar.logout')}
					</Button>
				</div>
			</div>
		</>
	);

	// Mobile sidebar with Sheet component
	if (isMobile) {
		return (
			<>
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="fixed right-4 top-4 z-40 warm-shadow-lg h-12 w-12 rounded-full border-2 border-gray-200 warm-gradient dark:warm-gradient-dark backdrop-blur-sm transition-all duration-300 dark:border-gray-700"
						>
							<span className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100/30 to-rose-100/30 dark:from-amber-900/30 dark:to-rose-900/30 opacity-70"></span>
							<Menu className="relative z-10 h-5 w-5 text-primary" />
						</Button>
					</SheetTrigger>
					<SheetContent
						side="right"
						className="w-[280px] border-none p-0 shadow-[0_0_50px_rgba(0,0,0,0.2)] dark:shadow-[0_0_50px_rgba(0,0,0,0.4)] sm:w-[320px]"
					>
						<SheetTitle className="sr-only">
							{t('user.sidebar.title')}
						</SheetTitle>
						<div className="flex h-full flex-col warm-gradient dark:warm-gradient-dark wedding-pattern overflow-hidden rounded-l-3xl">
							<SidebarContent />
						</div>
					</SheetContent>
				</Sheet>
			</>
		);
	}

	// Desktop sidebar
	return (
		<div
			ref={sidebarRef}
			className="fixed inset-y-0 right-0 z-30 mb-4 mr-4 mt-4 flex h-[calc(100vh-2rem)] w-64 flex-col warm-gradient dark:warm-gradient-dark wedding-pattern overflow-hidden rounded-3xl warm-shadow-lg transition-all duration-300 ease-in-out hover:shadow-[0_10px_50px_rgba(0,0,0,0.18),0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.25),0_2px_10px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_50px_rgba(0,0,0,0.3),0_5px_15px_rgba(0,0,0,0.15)]"
		>
			<SidebarContent />
		</div>
	);
}

interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
	onClick?: () => void;
}

function NavItem({ href, icon, label, isActive, onClick }: NavItemProps) {
	return (
		<Link href={href} className="block" onClick={onClick}>
			<div
				className={`group flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
					isActive 
						? `warm-shadow bg-gradient-to-r from-primary to-amber-600 text-white` 
						: `hover:warm-shadow hover:bg-white/50 dark:hover:bg-gray-800/50`
				}`}
			>
				<span
					className={`ml-3 transition-all ${
						isActive
							? 'text-white'
							: `text-gray-500 dark:text-gray-400`
					}`}
				>
					{icon}
				</span>
				<span className={
					isActive
						? 'text-white'
						: `text-gray-500 dark:text-gray-400`
				}>{label}</span>
			</div>
		</Link>
	);
}
