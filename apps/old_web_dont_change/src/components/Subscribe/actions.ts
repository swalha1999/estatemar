"use server";

import {
	createUpdatesLead,
	type UpdatesLead,
} from "@/utils/leads/updates_leads";

export async function submitSubscribe(
	formData: Omit<UpdatesLead, "id" | "created_at">,
) {
	await createUpdatesLead(formData);
}
