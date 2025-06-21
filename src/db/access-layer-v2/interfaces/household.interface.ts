import { households, Household, contacts, families, Contact, Family } from "@/db/schema-auth";
import { BaseSearchParams } from "./base.interface";

/**
 * Interface for the households table
 * @description This interface is used to define the structure of the households table
 * @returns {Object} The interface for the households table with the following fields:
 */
export const householdInterfaceSelect = {
    id: households.id,
    number: households.number,
    street: households.street,
    town: households.town,
}

export type HouseholdInterface = {
    id: Household['id'];
    number: Household['number'];
    street: Household['street'];
    town: Household['town'];
}

export interface HouseholdSearchParams extends BaseSearchParams {
    number?: Household['number'];
    street?: Household['street'];
    town?: Household['town'];
}
