'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/providers/auth-provider';
export function NavMain({
	items,
	isRTL = false,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		isSuperAdmin?: boolean;
		items?: {
			title: string;
			url: string;
			isSuperAdmin?: boolean;
		}[];
	}[];
	isRTL?: boolean;
}) {
	const { open } = useSidebar();
	const t = useTranslations('super.sidebar');
	const { user } = useAuth();

	return (
		<SidebarGroup>
			<SidebarGroupLabel className={`${isRTL ? 'text-right' : 'text-left'} admin-form-label`}>
				{t('platform')}
			</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item) => {
					if (item.isSuperAdmin && !user?.is_super_admin) return null;
					return (
						<div key={item.title}>
							{(item.items || []).length === 0 || !open ? (
								<Link href={item.url}>
									<SidebarMenuItem>
										<SidebarMenuButton 
											tooltip={item.title}
											className={`admin-dropdown-item ${isRTL ? 'flex-row-reverse' : ''} px-4 py-3 rounded-lg hover:bg-primary/10`}
										>
											{item.icon && <item.icon className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />}
											<span className="body-2 font-medium">{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</Link>
							) : (
								<Collapsible
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible"
								>
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton 
												tooltip={item.title}
												className={`admin-dropdown-item ${isRTL ? 'flex-row-reverse' : ''} px-4 py-3 rounded-lg hover:bg-primary/10`}
											>
												{item.icon && <item.icon className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />}
												<span className="body-2 font-medium">{item.title}</span>
												<ChevronRight className={`${isRTL ? 'mr-auto rotate-180' : 'ml-auto'} transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`} />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub className={isRTL ? 'pr-4' : 'pl-4'}>
												{item.items?.map((subItem) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton asChild>
															<Link href={subItem.url} className={`admin-dropdown-item body-2 ${isRTL ? 'text-right' : 'text-left'}`}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							)}
						</div>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
