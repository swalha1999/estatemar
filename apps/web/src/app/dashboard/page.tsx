"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

import data from "./data.json";

export default function Page() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	const privateData = useQuery(orpc.privateData.queryOptions());

	useEffect(() => {
		if (!session && !isPending) {
			router.push("/login");
		}
	}, [session, isPending, router]);
	return (
		<>
			<SectionCards />
		</>
	);
}
