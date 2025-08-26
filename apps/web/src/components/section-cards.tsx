import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
	return (
		<div className="grid @5xl/main:grid-cols-4 @xl/main:grid-cols-2 grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 dark:*:data-[slot=card]:bg-card">
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Total Views</CardDescription>
					<CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
						1000
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+100%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Total Views <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Total Views for the last 6 months
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Number of properties</CardDescription>
					<CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
						1,234
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingDown />
							-20%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Down 20% this period <IconTrendingDown className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Acquisition needs attention
					</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Active Listings</CardDescription>
					<CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
						2
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+100%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Strong user retention <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">Engagement exceed targets</div>
				</CardFooter>
			</Card>
			<Card className="@container/card">
				<CardHeader>
					<CardDescription>Growth Rate</CardDescription>
					<CardTitle className="font-semibold @[250px]/card:text-3xl text-2xl tabular-nums">
						4.5%
					</CardTitle>
					<CardAction>
						<Badge variant="outline">
							<IconTrendingUp />
							+4.5%
						</Badge>
					</CardAction>
				</CardHeader>
				<CardFooter className="flex-col items-start gap-1.5 text-sm">
					<div className="line-clamp-1 flex gap-2 font-medium">
						Active Listings <IconTrendingUp className="size-4" />
					</div>
					<div className="text-muted-foreground">
						Active Listings for the last 6 months
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
