import type { z } from "zod";
export declare const propertyTypeEnum: z.ZodEnum<{
    villa: "villa";
    apartment: "apartment";
    house: "house";
    condo: "condo";
    townhouse: "townhouse";
    commercial: "commercial";
}>;
export declare const propertyStatusEnum: z.ZodEnum<{
    "For Sale": "For Sale";
    "For Rent": "For Rent";
    Pending: "Pending";
    Sold: "Sold";
}>;
export declare const createPropertySchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    price: z.ZodNumber;
    type: z.ZodEnum<{
        villa: "villa";
        apartment: "apartment";
        house: "house";
        condo: "condo";
        townhouse: "townhouse";
        commercial: "commercial";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        "For Sale": "For Sale";
        "For Rent": "For Rent";
        Pending: "Pending";
        Sold: "Sold";
    }>>;
    bedrooms: z.ZodOptional<z.ZodNumber>;
    bathrooms: z.ZodOptional<z.ZodNumber>;
    area: z.ZodOptional<z.ZodNumber>;
    lotSize: z.ZodOptional<z.ZodNumber>;
    yearBuilt: z.ZodOptional<z.ZodNumber>;
    parking: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const addPropertyImageSchema: z.ZodObject<{
    propertyId: z.ZodString;
    objectKey: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodNumber;
    isPrimary: z.ZodDefault<z.ZodBoolean>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const addPropertyAmenitySchema: z.ZodObject<{
    propertyId: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export declare const getPropertiesSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updatePropertySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    type: z.ZodOptional<z.ZodEnum<{
        villa: "villa";
        apartment: "apartment";
        house: "house";
        condo: "condo";
        townhouse: "townhouse";
        commercial: "commercial";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        "For Sale": "For Sale";
        "For Rent": "For Rent";
        Pending: "Pending";
        Sold: "Sold";
    }>>;
    bedrooms: z.ZodOptional<z.ZodNumber>;
    bathrooms: z.ZodOptional<z.ZodNumber>;
    area: z.ZodOptional<z.ZodNumber>;
    lotSize: z.ZodOptional<z.ZodNumber>;
    yearBuilt: z.ZodOptional<z.ZodNumber>;
    parking: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const removePropertyImageSchema: z.ZodObject<{
    imageId: z.ZodString;
}, z.core.$strip>;
export declare const getPropertySchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export declare const propertySchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    price: z.ZodString;
    type: z.ZodString;
    status: z.ZodString;
    bedrooms: z.ZodNullable<z.ZodNumber>;
    bathrooms: z.ZodNullable<z.ZodString>;
    area: z.ZodNullable<z.ZodNumber>;
    lotSize: z.ZodNullable<z.ZodNumber>;
    yearBuilt: z.ZodNullable<z.ZodNumber>;
    parking: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const propertyImageSchema: z.ZodObject<{
    id: z.ZodString;
    propertyId: z.ZodString;
    objectKey: z.ZodString;
    fileName: z.ZodString;
    mimeType: z.ZodString;
    fileSize: z.ZodNumber;
    isPrimary: z.ZodBoolean;
    sortOrder: z.ZodNumber;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const propertyAmenitySchema: z.ZodObject<{
    id: z.ZodString;
    propertyId: z.ZodString;
    name: z.ZodString;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export declare const propertyWithDetailsSchema: z.ZodObject<{
    id: z.ZodString;
    userId: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    location: z.ZodString;
    price: z.ZodString;
    type: z.ZodString;
    status: z.ZodString;
    bedrooms: z.ZodNullable<z.ZodNumber>;
    bathrooms: z.ZodNullable<z.ZodString>;
    area: z.ZodNullable<z.ZodNumber>;
    lotSize: z.ZodNullable<z.ZodNumber>;
    yearBuilt: z.ZodNullable<z.ZodNumber>;
    parking: z.ZodNullable<z.ZodNumber>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    images: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        propertyId: z.ZodString;
        objectKey: z.ZodString;
        fileName: z.ZodString;
        mimeType: z.ZodString;
        fileSize: z.ZodNumber;
        isPrimary: z.ZodBoolean;
        sortOrder: z.ZodNumber;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
        signedUrl: z.ZodString;
    }, z.core.$strip>>;
    amenities: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const propertyResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PropertyType = z.infer<typeof propertyTypeEnum>;
export type PropertyStatus = z.infer<typeof propertyStatusEnum>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type AddPropertyImageInput = z.infer<typeof addPropertyImageSchema>;
export type AddPropertyAmenityInput = z.infer<typeof addPropertyAmenitySchema>;
export type RemovePropertyImageInput = z.infer<typeof removePropertyImageSchema>;
export type GetPropertiesInput = z.infer<typeof getPropertiesSchema>;
export type GetPropertyInput = z.infer<typeof getPropertySchema>;
export type Property = z.infer<typeof propertySchema>;
export type PropertyImage = z.infer<typeof propertyImageSchema>;
export type PropertyAmenity = z.infer<typeof propertyAmenitySchema>;
export type PropertyWithDetails = z.infer<typeof propertyWithDetailsSchema>;
export type PropertyResponse = z.infer<typeof propertyResponseSchema>;
