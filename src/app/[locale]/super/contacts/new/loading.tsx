import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewContactLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
				<Skeleton className="h-8 w-48" />
			</div>

			<Card>
				<CardContent className="pt-6">
					<div className="space-y-6">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>

						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							{Array.from({ length: 3 }).map((_, i) => (
								<div key={i} className="space-y-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-10 w-full" />
								</div>
							))}
						</div>

						<div className="flex flex-col gap-4">
							{Array.from({ length: 2 }).map((_, i) => (
								<div key={i} className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-32" />
								</div>
							))}
						</div>

						<div className="flex justify-end">
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
