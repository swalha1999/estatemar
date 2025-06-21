import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Skeleton className="h-10 w-48" />
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="space-y-4">
				<div className="flex items-center space-x-4">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="rounded-md border">
					<div className="border-b p-4">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-6 w-24" />
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-6 w-28" />
							<Skeleton className="h-6 w-36" />
							<Skeleton className="h-6 w-20" />
						</div>
					</div>
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="border-b p-4 last:border-b-0">
							<div className="flex items-center space-x-4">
								<Skeleton className="h-6 w-24" />
								<Skeleton className="h-6 w-32" />
								<Skeleton className="h-6 w-28" />
								<Skeleton className="h-6 w-36" />
								<Skeleton className="h-6 w-20" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
} 