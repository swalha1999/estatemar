import { db } from "@/db";
import { partner_leads } from "@/db/schema";
import { PartnerLead } from "@/db/schema";

export type { PartnerLead };

export const createPartnerLead = async (lead: Omit<PartnerLead, "id" | "created_at">) => {
    const createdLead = await db.insert(partner_leads).values(lead).returning();
    return createdLead[0];
};

export const getPartnerLeads = async (): Promise<PartnerLead[]> => {
    return await db.query.partner_leads.findMany();
};
