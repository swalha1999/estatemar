"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Page() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	return (
		<div className="flex items-center justify-between">
			<div>
				<h1 className="font-bold text-3xl">Dashboard</h1>
				<p className="text-muted-foreground">
					Here we will add the quick stats of the user and some quick actions to
					take
				</p>
			</div>
			<Link href="/dashboard/properties/add">
				<Button>Add New Property</Button>
			</Link>
		</div>

		//here add the reset of the page @ghassan
	);
}
