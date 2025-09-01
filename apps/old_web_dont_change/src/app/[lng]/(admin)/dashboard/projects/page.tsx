import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { fetchProjectsAction } from "./actions";
import { ProjectsTable } from "./components/projects-table";

interface ProjectsPageProps {
	params: Promise<{ lng: string }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { lng } = await params;
	const { data: projects } = await fetchProjectsAction(lng);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-3xl">Projects</h1>
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
