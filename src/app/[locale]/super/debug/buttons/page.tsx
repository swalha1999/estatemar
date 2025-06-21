'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

type ButtonVariants = VariantProps<typeof buttonVariants>;

type ButtonVariantType = NonNullable<ButtonVariants['variant']>;
type ButtonSizeType = NonNullable<ButtonVariants['size']>;

const variants = [
	'default',
	'destructive',
	'outline',
	'secondary',
	'ghost',
	'no_available',
	'link',
	'khaled',
] as const;
const sizes = ['default', 'sm', 'lg', 'icon'] as const;

function ButtonDemo({ variant, size }: { variant: ButtonVariantType; size: ButtonSizeType }) {
	return (
		<div className="flex flex-col items-center gap-2">
			<Button
				variant={variant}
				size={size}
				className="transition-all duration-700 hover:scale-110"
				onClick={() => navigator.clipboard.writeText(`variant="${variant}" size="${size}"`)}
			>
				Text
			</Button>
			<p className="text-xs text-muted-foreground">
				Size: {size} - Variant: {variant}
			</p>
		</div>
	);
}

export default function ButtonsPage() {
	return (
		<main dir="ltr" className="flex min-h-screen flex-col items-center justify-start p-8">
			<div className="mx-auto w-full max-w-7xl">
				<h1 className="mb-8 text-center text-3xl font-bold">Button Variants</h1>
				<p className="mb-8 text-center text-lg text-muted-foreground">
					Click on any button to copy its variant and size configuration
				</p>

				<div className="space-y-12">
					{sizes.map((size) => (
						<section key={size}>
							<h2 className="mb-6 text-center text-2xl font-semibold">
								Size: {size}
							</h2>
							<div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
								{variants.map((variant) => (
									<ButtonDemo
										key={`${variant}-${size}`}
										variant={variant}
										size={size}
									/>
								))}
							</div>
						</section>
					))}
				</div>

				<p className="mt-8 text-center text-lg text-muted-foreground">
					These buttons are using the shadcn/ui button component with all available
					variants and sizes.
					<br />
					The configuration will be copied to your clipboard when you click on a button.
				</p>
			</div>
		</main>
	);
}
