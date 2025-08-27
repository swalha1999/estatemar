import { z } from "zod";
export declare const uploadFileSchema: z.ZodObject<{
    file: z.ZodCustom<File, File>;
    fileName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const getSignedUrlSchema: z.ZodObject<{
    fileName: z.ZodString;
    expiresIn: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const deleteFileSchema: z.ZodObject<{
    fileName: z.ZodString;
}, z.core.$strip>;
export declare const fileUploadResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        objectKey: z.ZodString;
        uri: z.ZodString;
        signedUrl: z.ZodString;
        etag: z.ZodString;
        versionId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const signedUrlResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodObject<{
        signedUrl: z.ZodString;
        fileName: z.ZodString;
        expiresIn: z.ZodNumber;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const genericResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    message: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const fileListResponseSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        size: z.ZodNumber;
        lastModified: z.ZodDate;
        etag: z.ZodString;
    }, z.core.$strip>>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UploadFileInput = z.infer<typeof uploadFileSchema>;
export type GetSignedUrlInput = z.infer<typeof getSignedUrlSchema>;
export type DeleteFileInput = z.infer<typeof deleteFileSchema>;
export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;
export type SignedUrlResponse = z.infer<typeof signedUrlResponseSchema>;
export type GenericResponse = z.infer<typeof genericResponseSchema>;
export type FileListResponse = z.infer<typeof fileListResponseSchema>;
