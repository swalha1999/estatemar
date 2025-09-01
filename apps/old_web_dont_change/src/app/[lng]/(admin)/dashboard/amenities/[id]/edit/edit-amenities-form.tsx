"use client";

import type { Amenity } from "@/db/schema";
import { updateAmenity } from "../../actions";
import { AmenityForm } from "../../components/amenity-form";

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
	return (
		<AmenityForm
			title="Edit Amenity"
			initialData={initialData}
			onSubmit={handleSubmit}
		/>
	);
}
