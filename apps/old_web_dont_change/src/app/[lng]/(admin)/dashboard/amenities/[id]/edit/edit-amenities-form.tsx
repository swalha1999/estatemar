"use client";

import { Amenity } from "@/db/schema";
import { AmenityForm } from "../../components/amenity-form";
import { updateAmenity } from "../../actions";

interface EditAmenityFormProps {
    initialData: Amenity;
}

export default function EditAmenityForm({ initialData }: EditAmenityFormProps) {
    const handleSubmit = async (data: Partial<Amenity>) => {
        await updateAmenity({
            id: data.id?.toString() ?? "",
            name: data.name ?? "",
            description: data.description ?? "",
            icon: data.icon ?? "",
        });
    };
    return <AmenityForm title="Edit Amenity" initialData={initialData} onSubmit={handleSubmit} />;
}
