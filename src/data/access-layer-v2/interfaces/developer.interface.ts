import { developers, Developer } from "@/data/access-layer-v2/schemas/developer.schema";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the developer table
 * @description This interface is used to define the structure of the developer table
 * @returns {Object} The interface for the developer table with the following fields:
 */
export const developerInterfaceSelect = {
    id: developers.id,
    name: developers.name,
    email: developers.email,
    phone: developers.phone,
    companyInfo: developers.companyInfo,
    createdAt: developers.createdAt,
    updatedAt: developers.updatedAt,
    addedBy: developers.addedBy,
}

export type DeveloperInterface = {
    id: Developer['id'];
    name: Developer['name'];
    email: Developer['email'];
    phone: Developer['phone'];
    companyInfo: Developer['companyInfo'];
    createdAt: Developer['createdAt'];
    updatedAt: Developer['updatedAt'];
    addedBy: Developer['addedBy'];
}

export interface DeveloperSearchParams extends BaseSearchParams {
    name?: Developer['name'];
    email?: Developer['email'];
    phone?: Developer['phone'];
    companyInfo?: Developer['companyInfo'];
} 