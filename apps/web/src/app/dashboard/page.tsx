"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
					Welcome to your dashboard. This area is currently empty and ready for future features.
				</p>
			</div>
		</div>
	);
}
