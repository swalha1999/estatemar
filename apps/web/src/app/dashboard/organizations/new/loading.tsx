import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CreateOrganizationLoading() {
	return (
		<div className="container mx-auto py-8">
			<div className="mx-auto max-w-2xl">
				<div className="mb-8">
					<Skeleton className="mb-4 h-4 w-32" />
					<div className="flex items-center space-x-3">
						<Skeleton className="h-10 w-10 rounded-lg" />
						<div>
							<Skeleton className="mb-2 h-8 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
				</div>

				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-48" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-64" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-3 w-40" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-20 w-full" />
							<Skeleton className="h-3 w-56" />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
