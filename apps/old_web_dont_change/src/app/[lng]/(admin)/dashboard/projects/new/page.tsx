import { getAmenities } from "@/utils/content/amenities";
import { fetchDevelopers } from "../../developers/actions";
import { AddProjectForm } from "./add-project-form";

interface NewProjectPageProps {
    params: Promise<{ lng: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewProjectPage({ params }: NewProjectPageProps) {
    const { lng } = await params;
    const { data: developers } = await fetchDevelopers();
    const allAmenities = await getAmenities();

    return <AddProjectForm developers={developers || []} amenities={allAmenities} lng={lng} />;
}
