"use client";

import { redirect } from "next/navigation";
import type { Amenity, Developer } from "@/db/schema";
import type { CreateProjectData } from "@/utils/listings/project";
import { createProjectAction } from "../actions";
import { ProjectForm } from "../components/project-form";

interface AddProjectFormProps {
	developers: Developer[];
	amenities: Amenity[];
	lng: string;
}

export function AddProjectForm({
	developers,
	amenities,
	lng,
}: AddProjectFormProps) {
	const handleSubmit = async (data: CreateProjectData) => {
		const result = await createProjectAction(data);
		if (result.success) {
			redirect(`/${lng}/dashboard/projects`);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center">
				<h1 className="font-bold text-3xl">New Project</h1>
			</div>

			<ProjectForm
				developers={developers}
				amenities={amenities}
				onSubmit={handleSubmit}
				lng={lng}
			/>
		</div>
	);
}
