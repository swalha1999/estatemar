import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PaginationSkeleton = () => (
	<div className="flex items-center justify-center gap-2">
		<Skeleton className="h-9 w-9" />
		<Skeleton className="h-9 w-9" />
		<Skeleton className="h-4 w-20" />
		<Skeleton className="h-9 w-9" />
		<Skeleton className="h-9 w-9" />
	</div>
);

export default function ContactsLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<Skeleton className="h-9 w-48" />
				<Skeleton className="mt-4 h-10 w-32 sm:mt-0" />
			</div>

			<div className="grid grid-cols-1 gap-8">
				<Card>
					<CardHeader>
						<div className="flex items-center justify-between">
							<Skeleton className="h-6 w-32" />
							<div className="flex gap-4">
								{Array.from({ length: 7 }).map((_, i) => (
									<Skeleton key={i} className="h-4 w-20" />
								))}
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col space-y-4">
							{/* Filter skeletons */}
							<div className="flex flex-wrap gap-2">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton key={i} className="h-9 w-20 rounded-xl" />
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								{Array.from({ length: 4 }).map((_, i) => (
									<Skeleton key={i} className="h-9 w-20 rounded-xl" />
								))}
							</div>
							<div className="flex flex-wrap gap-2">
								{Array.from({ length: 6 }).map((_, i) => (
									<Skeleton key={i} className="h-9 w-24 rounded-xl" />
								))}
							</div>

							{/* Top pagination skeleton */}
							<PaginationSkeleton />

							{/* Table skeleton */}
							<div className="rounded-md border">
								<div className="p-4">
									{/* Table header */}
									<div className="grid grid-cols-12 gap-4 border-b pb-4">
										{Array.from({ length: 12 }).map((_, i) => (
											<Skeleton key={i} className="h-4 w-full" />
										))}
									</div>
									{/* Table rows */}
									{Array.from({ length: 10 }).map((_, i) => (
										<div
											key={i}
											className="grid grid-cols-12 gap-4 border-b py-4"
										>
											{Array.from({ length: 12 }).map((_, j) => (
												<Skeleton key={j} className="h-4 w-full" />
											))}
										</div>
									))}
								</div>
							</div>

							{/* Bottom pagination skeleton */}
							<PaginationSkeleton />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
