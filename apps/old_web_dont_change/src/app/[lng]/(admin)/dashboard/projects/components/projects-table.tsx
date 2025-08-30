"use client";

import { Project } from "@/db/schema";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "../actions";

interface ProjectsTableProps {
    projects: Project[];
    lng: string;
}

export function ProjectsTable({ projects, lng }: ProjectsTableProps) {
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProjectAction(id);
            router.refresh();
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString();
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Completion Date</TableHead>
                    <TableHead>Developer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((project) => (
                    <TableRow key={project.id}>
                        <TableCell className="font-medium">
                            <Link
                                href={`/${lng}/projects/${project.slug}`}
                                className="hover:underline flex items-center"
                            >
                                {project.name}
                                <Icon name="ExternalLink" className="ml-2 h-4 w-4" />
                            </Link>
                        </TableCell>
                        <TableCell>
                            {project.city}, {project.country}
                        </TableCell>
                        <TableCell>{formatDate(project.date_of_completion)}</TableCell>
                        <TableCell>{project.developer_id}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Link href={`/${lng}/dashboard/projects/${project.id}/edit`}>
                                    <Button variant="outline" size="icon">
                                        <Icon name="Pencil" className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDelete(project.id)}
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
