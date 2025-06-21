'use client';

import { Icon } from '@/components/icon';
import { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';

interface IconBrowserProps {
	icons: string[];
}

export function IconBrowser({ icons }: IconBrowserProps) {
	const [searchTerm, setSearchTerm] = useState('');

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
					className="w-full max-w-md rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
					onChange={(e) => debouncedSetSearch(e.target.value)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
				{filteredIcons.map((iconName) => (
					<div key={iconName} className="flex flex-col items-center gap-2">
						<Button variant="ghost" size="icon">
							<Icon name={iconName} size={24} />
						</Button>
						<div>{iconName}</div>
					</div>
				))}
			</div>

			<div className="mt-4 text-sm text-gray-500">
				Showing {filteredIcons.length} of {icons.length} icons
			</div>
		</div>
	);
}
