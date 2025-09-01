"use client";

import debounce from "lodash/debounce";
import { useMemo, useState } from "react";
import { Icon } from "@/components/icon";

interface IconBrowserProps {
	icons: string[];
}

export function IconBrowser({ icons }: IconBrowserProps) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredIcons = useMemo(() => {
		const lowercaseSearch = searchTerm.toLowerCase();
		return icons.filter((icon) => icon.toLowerCase().includes(lowercaseSearch));
	}, [icons, searchTerm]);

	const debouncedSetSearch = debounce((value: string) => {
		setSearchTerm(value);
	}, 300);

	return (
		<div>
			<div className="mb-6">
				<input
					type="text"
					placeholder="Search icons..."
					className="w-full max-w-md rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
					onChange={(e) => debouncedSetSearch(e.target.value)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
				{filteredIcons.map((iconName) => (
					<div
						key={iconName}
						className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-colors hover:bg-gray-50"
					>
						<Icon name={iconName} size={24} />
						<span className="break-all text-center text-gray-600 text-sm">
							{iconName}
						</span>
					</div>
				))}
			</div>

			<div className="mt-4 text-gray-500 text-sm">
				Showing {filteredIcons.length} of {icons.length} icons
			</div>
		</div>
	);
}
