"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import type { Developer } from "@/db/schema";
import { removeDeveloper } from "../actions";

interface DevelopersTableProps {
	developers: Developer[];
	lng: string;
}

export function DevelopersTable({ developers, lng }: DevelopersTableProps) {
	const router = useRouter();

	const handleDelete = async (id: number) => {
		if (confirm("Are you sure you want to delete this developer?")) {
			const result = await removeDeveloper(id);
			if (result.success) {
				router.refresh();
			} else {
				console.error("Failed to delete developer:", result.error);
			}
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Contact</TableHead>
					<TableHead>Website</TableHead>
					<TableHead>Social Media</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{developers.map((developer) => (
					<TableRow key={developer.id}>
						<TableCell className="font-medium">{developer.name}</TableCell>
						<TableCell>
							<div className="space-y-1">
								{developer.email && (
									<div className="text-sm">{developer.email}</div>
								)}
								{developer.phone && (
									<div className="text-sm">{developer.phone}</div>
								)}
							</div>
						</TableCell>
						<TableCell>
							{developer.website && (
								<a
									href={developer.website}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center text-blue-600 hover:text-blue-800"
								>
									Visit <Icon name="ExternalLink" className="ml-1 h-3 w-3" />
								</a>
							)}
						</TableCell>
						<TableCell>
							<div className="flex gap-2">
								{developer.facebook && (
									<a
										href={developer.facebook}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800"
									>
										FB
									</a>
								)}
								{developer.instagram && (
									<a
										href={developer.instagram}
										target="_blank"
										rel="noopener noreferrer"
										className="text-pink-600 hover:text-pink-800"
									>
										IG
									</a>
								)}
								{developer.linkedin && (
									<a
										href={developer.linkedin}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-600 hover:text-blue-800"
									>
										IN
									</a>
								)}
								{developer.twitter && (
									<a
										href={developer.twitter}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-400 hover:text-blue-600"
									>
										TW
									</a>
								)}
							</div>
						</TableCell>
						<TableCell>
							<div className="flex gap-2">
								<Link
									href={`/${lng}/dashboard/developers/${developer.id}/edit`}
								>
									<Button variant="outline" size="icon">
										<Icon name="Pencil" className="h-4 w-4" />
									</Button>
								</Link>
								<Button
									variant="destructive"
									size="icon"
									onClick={() => handleDelete(developer.id)}
								>
									<Icon name="Trash" className="h-4 w-4" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
