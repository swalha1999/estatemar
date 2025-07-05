'use client';

import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import { Skeleton } from '../ui/skeleton';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useParams, usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { getLabelForParam } from './actions';

interface BreadcrumbLayoutProps {
	children: React.ReactNode;
}

export const BreadcrumbLayout = ({ children }: BreadcrumbLayoutProps) => {
	const t = useTranslations('super.breadcrumb');
	const pages = useSelectedLayoutSegments();
	const params = useParams();
	const [breadcrumbConfig, setBreadcrumbConfig] = useState<
		Array<{ label: string; href: string }>
	>([]);
	const pathname = usePathname();

	const generateBreadcrumbs = useCallback(async () => {
		const paramValues = Object.values(params);
		const filteredPages = pages.filter(
			(page) => page !== '' && !page.startsWith('[') && !page.startsWith('(')
		);

		filteredPages.unshift('main');

		const config = [];
		let currentPath = '';
		let t_key = '';

		for (const page of filteredPages) {
			currentPath = currentPath === '' ? `/super` : `${currentPath}/${page}`;

			if (paramValues.includes(page)) {
				const paramKey = Object.keys(params).find((key) => params[key] === page);
				if (!paramKey) {
					continue;
				}
				t_key = t_key === '' ? paramKey : `${t_key}_${paramKey}`;

				const label = await getLabelForParam(paramKey, page);
				config.push({
					label: label,
					href: currentPath,
				});
			} else {
				t_key = t_key === '' ? page : `${t_key}_${page}`;
				config.push({
					label: t(t_key),
					href: currentPath,
				});
			}
		}
		setBreadcrumbConfig(config);
	}, [pathname]);

	useEffect(() => {
		generateBreadcrumbs();
	}, [generateBreadcrumbs]);

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumbs config={breadcrumbConfig} />
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
		</>
	);
};

interface LoadingLayoutProps {
	children: React.ReactNode;
}

export const LoadingLayout = ({ children }: LoadingLayoutProps) => {
	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<Skeleton className="h-8 w-8" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-32" />
				</div>
			</header>
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
		</>
	);
};
