import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
	return (
		<div className="space-y-6">
			{/* Header Skeleton */}
			<div>
				<Skeleton className="mb-2 h-10 w-[250px]" />
				<Skeleton className="h-5 w-[300px]" />
			</div>

			{/* Button Variants Card Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-[180px]" />
					<Skeleton className="h-4 w-[150px]" />
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Default Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>

						{/* Secondary Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>

						{/* Destructive Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>

						{/* Outline Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>

						{/* Ghost Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>

						{/* Link Buttons */}
						<div className="space-y-2">
							<Skeleton className="h-5 w-[100px]" />
							<div className="flex flex-wrap gap-4">
								{[1, 2, 3, 4, 5].map((i) => (
									<Skeleton key={i} className="h-10 w-[100px]" />
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Button Sizes Card Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-[180px]" />
					<Skeleton className="h-4 w-[150px]" />
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-center gap-4">
						<Skeleton className="h-8 w-[80px]" />
						<Skeleton className="h-10 w-[100px]" />
						<Skeleton className="h-12 w-[120px]" />
					</div>
				</CardContent>
			</Card>

			{/* Button With Icons Card Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-[180px]" />
					<Skeleton className="h-4 w-[150px]" />
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-10 w-[150px]" />
						))}
					</div>
				</CardContent>
			</Card>

			{/* Loading Buttons Card Skeleton */}
			<Card>
				<CardHeader>
					<Skeleton className="h-6 w-[180px]" />
					<Skeleton className="h-4 w-[150px]" />
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						{[1, 2, 3, 4].map((i) => (
							<Skeleton key={i} className="h-10 w-[150px]" />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
