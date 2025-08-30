"use client";

import * as React from "react";
import { useTheme } from "next-themes";
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
            className="w-16 h-8 rounded-full bg-gray-300 dark:bg-gray-600 relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
            aria-label="Toggle theme"
        >
            <div
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    theme === "dark" ? "translate-x-8" : ""
                }`}
            >
                {theme === "light" ? (
                    <Icon
                        name="Sun"
                        className="h-4 w-4 text-yellow-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                ) : (
                    <Icon
                        name="Moon"
                        className="h-4 w-4 text-blue-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                )}
            </div>
        </button>
    );
}
