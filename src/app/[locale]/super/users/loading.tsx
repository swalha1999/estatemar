import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container mx-auto py-10">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-9 w-48" />
					<Skeleton className="h-10 w-32" />
				</div>

				<div className="rounded-md border">
					<div className="p-6">
						<div className="space-y-4">
							{/* Table header */}
							<div className="grid grid-cols-4 gap-4">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-12" />
								<Skeleton className="h-4 w-16" />
							</div>
							
							{/* Table rows */}
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="grid grid-cols-4 gap-4">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-4 w-20" />
									<Skeleton className="h-8 w-8" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 