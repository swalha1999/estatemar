import { leads, Lead } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the leads table
 * @description This interface is used to define the structure of the leads table
 * @returns {Object} The interface for the leads table with the following fields:
 */
export const leadInterfaceSelect = {
    id: leads.id,
    brideName: leads.brideName,
    groomName: leads.groomName,
    phone: leads.phone,
    email: leads.email,
    createdAt: leads.createdAt,
}

export type LeadInterface = {
    id: Lead['id'];
    brideName: Lead['brideName'];
    groomName: Lead['groomName'];
    phone: Lead['phone'];
    email: Lead['email'];
    createdAt: Lead['createdAt'];
} 

export interface LeadSearchParams extends BaseSearchParams {
    brideName?: Lead['brideName'];
    groomName?: Lead['groomName'];
    phone?: Lead['phone'];
    email?: Lead['email'];
    createdAt?: Lead['createdAt'];
}