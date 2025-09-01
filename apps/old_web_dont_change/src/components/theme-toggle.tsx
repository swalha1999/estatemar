"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Icon } from "@/components/icon";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<button
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
			className="relative h-8 w-16 rounded-full bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-600 dark:focus:ring-blue-600"
			aria-label="Toggle theme"
		>
			<div
				className={`absolute top-1 left-1 h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
					theme === "dark" ? "translate-x-8" : ""
				}`}
			>
				{theme === "light" ? (
					<Icon
						name="Sun"
						className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-4 w-4 transform text-yellow-500"
					/>
				) : (
					<Icon
						name="Moon"
						className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-4 w-4 transform text-blue-300"
					/>
				)}
			</div>
		</button>
	);
}
