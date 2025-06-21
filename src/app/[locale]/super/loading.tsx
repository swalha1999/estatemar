import { LoadingLayout } from '@/components/layouts/admin_page_layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
	return (
		<LoadingLayout>
			<div className="space-y-6">
				{/* Header Skeleton */}
				<div>
					<Skeleton className="mb-2 h-10 w-[250px]" />
					<Skeleton className="h-5 w-[300px]" />
				</div>

				{/* Stats Cards Skeleton */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<Card key={i}>
							<CardHeader className="pb-2">
								<Skeleton className="h-6 w-[150px]" />
							</CardHeader>
							<CardContent>
								<Skeleton className="h-8 w-[80px]" />
							</CardContent>
						</Card>
					))}
				</div>

				{/* Quick Access Cards Skeleton */}
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

				{/* Recent Activity Skeleton */}
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-[180px]" />
						<Skeleton className="h-4 w-[150px]" />
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{[1, 2, 3, 4, 5].map((i) => (
								<div key={i} className="flex items-start gap-4 border-b py-2">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="flex-1 space-y-1">
										<Skeleton className="h-5 w-[200px]" />
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-[100px]" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</LoadingLayout>
	);
}
