"use client";
import type { Amenity } from "@/db/schema";
import { createAmenity } from "../actions";
import { AmenityForm } from "../components/amenity-form";

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
