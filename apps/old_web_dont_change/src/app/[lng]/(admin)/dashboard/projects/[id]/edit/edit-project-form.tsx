"use client";

import { Amenity, Developer } from "@/db/schema";
import { CreateProjectData, ProjectDetails } from "@/utils/listings/project";
import { redirect } from "next/navigation";
import { updateProjectAction } from "../../actions";
import { ProjectForm } from "../../components/project-form";

interface EditProjectFormProps {
    project: ProjectDetails;
    developers: Developer[] | null;
    amenities: Amenity[] | null;
    lng: string;
}

export function EditProjectForm({ project, developers, amenities, lng }: EditProjectFormProps) {
    const handleSubmit = async (data: CreateProjectData) => {
        const result = await updateProjectAction(project.id, data);
        if (result.success) {
            redirect(`/${lng}/dashboard/projects`);
        }
    };

    return (
        <ProjectForm
            developers={developers || []}
            amenities={amenities || []}
            onSubmit={handleSubmit}
            initialData={{
                ...project,
                amenity_ids: project.amenities?.map((a) => a.amenity.id) || [],
                images: project.images?.map((i) => i.image) || [],
                files: project.files?.map((f) => f.file) || [],
            }}
            lng={lng}
        />
    );
}
