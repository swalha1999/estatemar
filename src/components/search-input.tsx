'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchInputProps {
	paramName: string;
	placeholder?: string;
	className?: string;
}

export function SearchInput({ paramName, placeholder, className }: SearchInputProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	
	// Initialize from URL params
	const initialValue = searchParams.get(paramName) || '';
	const [searchValue, setSearchValue] = useState(initialValue);
	const debouncedSearchValue = useDebounce(searchValue, 500);

	// Update URL when debounced value changes
	useEffect(() => {
		const newParams = new URLSearchParams(searchParams.toString());
		
		if (debouncedSearchValue.trim()) {
			newParams.set(paramName, debouncedSearchValue.trim());
		} else {
			newParams.delete(paramName);
		}
		
		// Reset page when searching
		newParams.delete('page');
		
		const newUrl = newParams.toString();
		const currentUrl = searchParams.toString();
		
		// Only update if URL actually changes
		if (newUrl !== currentUrl) {
			router.replace(`?${newUrl}`, { scroll: false });
		}
	}, [debouncedSearchValue, paramName, router]);

	// Sync with URL changes (e.g., when navigating back/forward)
	useEffect(() => {
		const urlValue = searchParams.get(paramName) || '';
		if (urlValue !== searchValue) {
			setSearchValue(urlValue);
		}
	}, [searchParams.get(paramName)]);

	const clearSearch = () => {
		setSearchValue('');
	};

	return (
		<div className={`relative ${className}`}>
			<Input
				type="text"
				placeholder={placeholder}
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				className="h-8 pr-8 text-xs"
			/>
			{searchValue && (
				<Button
					variant="ghost"
					size="sm"
					onClick={clearSearch}
					className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 transform p-0 hover:bg-transparent"
				>
					<X className="h-3 w-3" />
				</Button>
			)}
		</div>
	);
}
