import { fetchProjectByIdAction } from "../../actions";
import { EditProjectForm } from "./edit-project-form";
import { fetchDevelopersAction, fetchAmenitiesAction } from "../../actions";

interface EditProjectPageProps {
    params: Promise<{ lng: string; id: string }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
    const { lng, id } = await params;
    const projectId = parseInt(id);

    const projectResponse = await fetchProjectByIdAction(projectId);
    const { data: developers } = await fetchDevelopersAction();
    const { data: amenities } = await fetchAmenitiesAction();

    if (!projectResponse.success || !projectResponse.data) {
        return <div>Project not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <h1 className="text-3xl font-bold">Edit Project</h1>
            </div>

            <EditProjectForm
                project={projectResponse.data}
                developers={developers || []}
                amenities={amenities || []}
                lng={lng}
            />
        </div>
    );
}
