import { Skeleton } from '@/components/ui/skeleton';

export default function EditContactLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<Skeleton className="h-8 w-48" />
			</div>

			<div className="grid grid-cols-1 gap-8">
				<div className="space-y-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
						))}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="flex items-center space-x-2 rtl:space-x-reverse"
							>
								<Skeleton className="h-4 w-4" />
								<Skeleton className="h-4 w-24" />
							</div>
						))}
					</div>

					<div className="flex justify-end">
						<Skeleton className="h-10 w-32" />
					</div>
				</div>
			</div>
		</div>
		// </breadcrumbLayout>
	);
}
