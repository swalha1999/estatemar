import { LoadingLayout } from '@/components/layouts/admin_page_layout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<LoadingLayout>
			<div className="space-y-6">
				{/* Header Skeleton */}
				<div>
					<Skeleton className="mb-2 h-10 w-[250px]" />
					<Skeleton className="h-5 w-[300px]" />
				</div>

				{/* Debug Tools Grid Skeleton */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<Card key={i}>
							<CardHeader>
								<Skeleton className="h-6 w-[180px]" />
								<Skeleton className="h-4 w-[150px]" />
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-10 w-[120px]" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* System Info Skeleton */}
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-[180px]" />
						<Skeleton className="h-4 w-[150px]" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div className="space-y-2">
									<Skeleton className="h-5 w-[150px]" />
									<Skeleton className="h-6 w-[200px]" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-5 w-[150px]" />
									<Skeleton className="h-6 w-[200px]" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-5 w-[150px]" />
									<Skeleton className="h-6 w-[200px]" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-5 w-[150px]" />
									<Skeleton className="h-6 w-[200px]" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</LoadingLayout>
	);
}
