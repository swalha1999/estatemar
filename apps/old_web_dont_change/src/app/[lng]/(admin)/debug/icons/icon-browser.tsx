'use client';

import { Icon } from "@/components/icon";
import { useState, useMemo } from "react";
import debounce from "lodash/debounce";

interface IconBrowserProps {
    icons: string[];
}

export function IconBrowser({ icons }: IconBrowserProps) {
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredIcons = useMemo(() => {
        const lowercaseSearch = searchTerm.toLowerCase();
        return icons.filter(icon => 
            icon.toLowerCase().includes(lowercaseSearch)
        );
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
                    className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => debouncedSetSearch(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredIcons.map((iconName) => (
                    <div
                        key={iconName}
                        className="p-4 border rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <Icon name={iconName} size={24} />
                        <span className="text-sm text-gray-600 text-center break-all">
                            {iconName}
                        </span>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredIcons.length} of {icons.length} icons
            </div>
        </div>
    );
} 