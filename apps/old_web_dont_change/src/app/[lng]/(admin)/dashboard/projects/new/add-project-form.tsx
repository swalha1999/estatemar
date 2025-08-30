"use client";

import { createProjectAction } from "../actions";
import { redirect } from "next/navigation";
import { ProjectForm } from "../components/project-form";
import { Developer, Amenity } from "@/db/schema";
import { CreateProjectData } from "@/utils/listings/project";

interface AddProjectFormProps {
    developers: Developer[];
    amenities: Amenity[];
    lng: string;
}

export function AddProjectForm({ developers, amenities, lng }: AddProjectFormProps) {
    const handleSubmit = async (data: CreateProjectData) => {
        const result = await createProjectAction(data);
        if (result.success) {
            redirect(`/${lng}/dashboard/projects`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold">New Project</h1>
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
