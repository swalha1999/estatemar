"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function Page(): React.JSX.Element {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);

	if (isPending) {
		return (
			<div className="container mx-auto space-y-8 py-8">
				<div className="flex items-center justify-between">
					<div>
						<div className="mb-2 h-8 w-48 animate-pulse rounded bg-muted" />
						<div className="h-4 w-96 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto space-y-8 py-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">Dashboard</h1>
					<p className="text-muted-foreground">Welcome to your dashboard.</p>
				</div>
			</div>
		</div>
	);
}
