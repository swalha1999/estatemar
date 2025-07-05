import { Skeleton } from '@/components/ui/skeleton';

export default function PropertiesLoading() {
	return (
		<div className="container mx-auto p-6">
			<div className="mb-6">
				<Skeleton className="h-8 w-64 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>
			
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-32" />
				</div>
				
				<div className="rounded-md border">
					<div className="p-4">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="flex items-center space-x-4 py-4">
								<Skeleton className="h-12 w-12" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-4 w-16" />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
} 