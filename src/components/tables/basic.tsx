'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { useDataTable } from '@/hooks/use-data-table';
import type { Column } from '@/hooks/use-data-table';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import { Locale } from 'next-intl';

interface BasicTableProps<T extends { id: number | string }> {
	columns: Column<T>[];
	data: T[];
}

export function BasicTable<T extends { id: number | string }>({
	columns,
	data,
}: BasicTableProps<T>) {
	const { locale } = useParams();
	const table = useDataTable<T>({
		data,
		columns,
	});

	return (
		<div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{table.getColumns().map((column, index) => (
								<TableHead
									key={String(
										column.accessorKey ?? column.id ?? `column-${index}`
									)}
								>
									{typeof column.header === 'function'
										? column.header(table)
										: typeof column.header === 'string'
											? column.header
											: column.header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{table.getRows().length ? (
							table.getRows().map((row: T) => (
								<TableRow key={row.id}>
									{table.getColumns().map((column, index) => (
										<TableCell
											key={
												String(
													column.accessorKey ??
														column.id ??
														`cell-${index}-`
												) + String(row.id)
											}
										>
											{column.cell
												? column.cell(row, locale as Locale)
												: column.accessorKey
													? String(row[column.accessorKey])
													: null}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getColumns().length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="mt-4 flex justify-end">
				<Button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
					Next Page
				</Button>
				<Button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
					Previous Page
				</Button>
			</div>
		</div>
	);
}
