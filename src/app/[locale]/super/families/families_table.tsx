'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { deleteFamilyAction } from '@/app/[locale]/super/families/actions';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Family {
	id: number;
	name: string;
	memberCount: number;
}

interface FamiliesTableProps {
	families: Family[];
	isSuperAdmin: boolean;
}

export function FamiliesTable({ families, isSuperAdmin }: FamiliesTableProps) {
	const t = useTranslations('super.families');

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableCell>{t('id')}</TableCell>
						<TableCell>{t('name')}</TableCell>
						<TableCell>{t('members')}</TableCell>
						<TableCell>{t('actions')}</TableCell>
					</TableRow>
				</TableHeader>
				<TableBody>
					{families.map((family) => (
						<TableRow key={family.id}>
							<TableCell>{family.id}</TableCell>
							<TableCell>{family.name}</TableCell>
							<TableCell>{family.memberCount}</TableCell>
							<TableCell>
								<FamilyActions family={family} isSuperAdmin={isSuperAdmin} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

function FamilyActions({ family, isSuperAdmin }: { family: Family; isSuperAdmin: boolean }) {
	const t = useTranslations('super.families');
	const router = useRouter();

	const handleDelete = async (id: number) => {
		await deleteFamilyAction(id).then(() => {
			router.refresh();
		});
	};

	return (
		<div className="flex gap-2">
			<Link href={`/super/families/${family.id}/edit`}>
				<Button variant="outline" size="sm">
					<Pencil className="h-4 w-4" />
				</Button>
			</Link>
			{isSuperAdmin && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive" size="sm">
							<Trash2 className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{t('delete_confirmation_title')}</AlertDialogTitle>
							<AlertDialogDescription>
								{t('delete_confirmation_description')}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
							<AlertDialogAction asChild>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => handleDelete(family.id)}
								>
									{t('confirm')}
								</Button>
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);
}
