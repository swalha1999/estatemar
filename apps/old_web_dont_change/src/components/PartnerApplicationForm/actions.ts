"use server";

import { createPartnerLead, PartnerLead } from "@/utils/leads/partner_leads";

export async function submitPartnerApplication(
    formData: Omit<PartnerLead, "id" | "created_at">
): Promise<{ success: boolean }> {
    try {
        await createPartnerLead(formData);
        return { success: true };
    } catch (error) {
        console.error("Error submitting partner application:", error);
        return { success: false };
    }
}
