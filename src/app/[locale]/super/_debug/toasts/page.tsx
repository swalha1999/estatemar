'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const variants = ['default', 'success', 'error', 'warning', 'info', 'destructive'] as const;

export default function ToastsPage() {
	const { toast } = useToast();

	return (
		<main dir="ltr" className="flex min-h-screen flex-col items-center justify-start p-8">
			<div className="mx-auto w-full max-w-7xl">
				<h1 className="mb-8 text-center text-3xl font-bold">Toast Variants</h1>
				<p className="mb-8 text-center text-lg text-muted-foreground">
					Click on any button to show its toast variant
				</p>

				<div className="grid grid-cols-2 place-items-center gap-6 sm:grid-cols-3">
					{variants.map((variant) => (
						<div key={variant} className="flex flex-col items-center gap-2">
							<Button
								onClick={() => {
									toast({
										variant: variant,
										title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
										description: `This is a ${variant} toast notification`,
									});
								}}
								className="transition-all duration-700 hover:scale-110"
							>
								Show {variant} toast
							</Button>
							<p className="text-xs text-muted-foreground">Variant: {variant}</p>
						</div>
					))}
				</div>

				<p className="mt-8 text-center text-lg text-muted-foreground">
					These toasts are using the shadcn/ui toast component with all available
					variants.
					<br />
					Click the buttons to see how each toast variant appears.
				</p>
			</div>
		</main>
	);
}
