import { families, Family } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the families table
 * @description This interface is used to define the structure of the families table
 * @returns {Object} The interface for the families table with the following fields:
 */
export const familyInterfaceSelect = {
    id: families.id,
    name: families.name,
}

export type FamilyInterface = {
    id: Family['id'];
    name: Family['name'];
}

export interface FamilySearchParams extends BaseSearchParams {
    name?: string;
}