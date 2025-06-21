'use client';

import { useEffect, useState } from 'react';

const colorVariables = [
	'primary',
	'primary-foreground',
	'secondary',
	'secondary-foreground',
	'background',
	'foreground',
	'card',
	'card-foreground',
	'popover',
	'popover-foreground',
	'accent',
	'accent-foreground',
	'destructive',
	'destructive-foreground',
	'muted',
	'muted-foreground',
	'border',
	'input',
	'ring',
];

function getColorValue(variable: string, isDark: boolean = false) {
	if (typeof window === 'undefined') return '';
	const root = document.documentElement;
	root.classList.toggle('dark', isDark);
	const value = getComputedStyle(root).getPropertyValue(`--${variable}`).trim();
	root.classList.toggle('dark', false);

	// Check if value is HSL format
	if (value.includes(' ')) {
		return `hsl(${value})`;
	}
	return value;
}

function ColorSquare({ name, color }: { name: string; color: string }) {
	return (
		<div className="flex flex-col items-center gap-2">
			<div
				className="h-24 w-24 cursor-pointer rounded-lg border border-border shadow-lg transition-all duration-700 hover:scale-110 hover:shadow-xl"
				style={{ backgroundColor: color }}
				onClick={() => navigator.clipboard.writeText(name)}
			/>
			<p className="text-sm font-medium">{name}</p>
			<p className="text-xs text-muted-foreground">{color}</p>
		</div>
	);
}

export default function ColorsPage() {
	const [colors, setColors] = useState<{
		light: Record<string, string>;
		dark: Record<string, string>;
	}>({ light: {}, dark: {} });

	useEffect(() => {
		const lightColors: Record<string, string> = {};
		const darkColors: Record<string, string> = {};

		colorVariables.forEach((variable) => {
			lightColors[variable] = getColorValue(variable, false);
			darkColors[variable] = getColorValue(variable, true);
		});

		setColors({ light: lightColors, dark: darkColors });
	}, []);

	return (
		<main dir="ltr" className="flex min-h-screen flex-col items-center justify-start p-8">
			<div className="mx-auto w-full max-w-7xl">
				<h1 className="mb-8 text-center text-3xl font-bold">Color Palette</h1>
				<p className="mb-8 text-center text-lg text-muted-foreground">
					Click on the color to copy the color value to the clipboard
				</p>

				<div className="space-y-12">
					<section>
						<h2 className="mb-6 text-center text-2xl font-semibold">
							Light Theme Colors
						</h2>
						<div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{Object.entries(colors.light).map(([name, color]) => (
								<ColorSquare key={name} name={name} color={color} />
							))}
						</div>
					</section>

					<section>
						<h2 className="mb-6 text-center text-2xl font-semibold">
							Dark Theme Colors
						</h2>
						<div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{Object.entries(colors.dark).map(([name, color]) => (
								<ColorSquare key={name} name={name} color={color} />
							))}
						</div>
					</section>
				</div>
				<p className="mt-8 text-center text-lg text-muted-foreground">
					if you want to change the color, you can change the value in the global.css file{' '}
					<strong>
						{' '}
						but please please please make sure to change the value in the global.css
						file not in the tailwind.config.ts file
					</strong>
					<br />
					and consider using{' '}
					<a
						href="https://ui.shadcn.com/colors"
						target="_blank"
						className="text-blue-500"
					>
						shadcn/ui
					</a>{' '}
					for the colors
				</p>
			</div>
		</main>
	);
}
