import { useState } from 'react';
import { Locale } from 'next-intl';
export type Column<T> = {
	id?: string;
	accessorKey?: keyof T;
	header:
		| string
		| React.ReactNode
		| ((
				table: ReturnType<typeof useDataTable<T & { id: number | string }>>
		  ) => React.ReactNode);
	cell?: (row: T, locale: Locale) => React.ReactNode;
	enableSorting?: boolean;
	enableHiding?: boolean;
};

interface UseDataTableProps<T> {
	data: T[];
	columns: Column<T>[];
}

export function useDataTable<T>({ data, columns }: UseDataTableProps<T>) {
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const getColumns = () => {
		return columns;
	};

	const getRows = () => {
		return data.slice((page - 1) * pageSize, page * pageSize);
	};

	const getTotal = () => {
		return data.length;
	};

	const getCanNextPage = () => {
		return page < Math.ceil(data.length / pageSize);
	};

	const getCanPreviousPage = () => {
		return page > 1;
	};

	const nextPage = () => {
		if (getCanNextPage()) {
			setPage(page + 1);
		}
	};

	const previousPage = () => {
		if (getCanPreviousPage()) {
			setPage(page - 1);
		}
	};

	return {
		getColumns,
		getRows,
		getTotal,
		page,
		setPage,
		pageSize,
		setPageSize,
		getCanNextPage,
		getCanPreviousPage,
		nextPage,
		previousPage,
	};
}
