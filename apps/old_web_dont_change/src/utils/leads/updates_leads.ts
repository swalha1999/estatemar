import { db } from "@/db";
import { updates_leads } from "@/db/schema";
import { UpdatesLead } from "@/db/schema";

export type { UpdatesLead };

export const createUpdatesLead = async (lead: Omit<UpdatesLead, "id" | "created_at">) => {
    const createdLead = await db.insert(updates_leads).values(lead).returning();
    return createdLead[0];
};

export const getUpdatesLeads = async (): Promise<UpdatesLead[]> => {
    return await db.query.updates_leads.findMany();
};
