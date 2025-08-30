"use client";
import { Amenity } from "@/db/schema";
import { AmenityForm } from "../components/amenity-form";
import { createAmenity } from "../actions";

export default function NewAmenityForm() {
    const handleSubmit = async (data: Partial<Amenity>) => {
        if (!data.name) throw new Error("Name is required");

        await createAmenity({
            ...data,
            name: data.name,
            icon: data.icon ?? "",
            description: data.description ?? undefined,
        });
    };
    return <AmenityForm title="New Amenity" onSubmit={handleSubmit} />;
}
