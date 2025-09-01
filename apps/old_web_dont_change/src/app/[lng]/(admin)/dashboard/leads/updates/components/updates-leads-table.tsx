"use client";

import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { UpdatesLead } from "@/db/schema";

interface UpdatesLeadsTableProps {
	leads: UpdatesLead[];
	lng: string;
}

export function UpdatesLeadsTable({ leads, lng }: UpdatesLeadsTableProps) {
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Phone</TableHead>
					<TableHead>Date</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{leads.map((lead) => (
					<TableRow key={lead.id}>
						<TableCell>{lead.name}</TableCell>
						<TableCell>{lead.email}</TableCell>
						<TableCell>{lead.phone}</TableCell>
						<TableCell>{formatDate(lead.created_at)}</TableCell>
						<TableCell className="text-right">
							<Button variant="ghost" size="icon" asChild>
								<a href={`mailto:${lead.email}`}>
									<Icon name="Mail" className="h-4 w-4" />
								</a>
							</Button>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
