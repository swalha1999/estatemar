import { notFound } from "next/navigation";
import { getAmenity } from "../../actions";
import EditAmenityForm from "./edit-amenities-form";

interface EditAmenityPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditAmenityPage({ params }: EditAmenityPageProps) {
    const resolvedParams = await params;
    const initialData = await getAmenity(resolvedParams.id);
    if (!initialData) {
        notFound();
    }
    return (
        <div className="container mx-auto py-6">
            <EditAmenityForm initialData={initialData} />
        </div>
    );
}
