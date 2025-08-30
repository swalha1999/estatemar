import { ProjectsTable } from "./components/projects-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchProjectsAction } from "./actions";
import { Icon } from "@/components/icon";

interface ProjectsPageProps {
    params: Promise<{ lng: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
    const { lng } = await params;
    const { data: projects } = await fetchProjectsAction(lng);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Projects</h1>
                <Link href={`/${lng}/dashboard/projects/new`}>
                    <Button>
                        <Icon name="Plus" className="mr-2 h-4 w-4" />
                        Add Project
                    </Button>
                </Link>
            </div>

            <ProjectsTable projects={projects} lng={lng} />
        </div>
    );
}
