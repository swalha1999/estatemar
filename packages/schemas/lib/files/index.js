import { File } from "@web-std/file";
import { z } from "zod";
// Upload file schema
export const uploadFileSchema = z.object({
    file: z.instanceof(File),
    fileName: z.string().optional(),
});
// Get signed URL schema
export const getSignedUrlSchema = z.object({
    fileName: z.string(),
    expiresIn: z.number().default(3600), // 1 hour default
});
// Delete file schema
export const deleteFileSchema = z.object({
    fileName: z.string(),
});
// File upload response schema
export const fileUploadResponseSchema = z.object({
    success: z.boolean(),
    data: z
        .object({
        objectKey: z.string(),
        uri: z.string(),
        signedUrl: z.string(),
        etag: z.string(),
        versionId: z.string().optional(),
    })
        .optional(),
    error: z.string().optional(),
});
// Signed URL response schema
export const signedUrlResponseSchema = z.object({
    success: z.boolean(),
    data: z
        .object({
        signedUrl: z.string(),
        fileName: z.string(),
        expiresIn: z.number(),
    })
        .optional(),
    error: z.string().optional(),
});
// Generic response schema
export const genericResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
});
// File list response schema
export const fileListResponseSchema = z.object({
    success: z.boolean(),
    data: z
        .array(z.object({
        key: z.string(),
        size: z.number(),
        lastModified: z.date(),
        etag: z.string(),
    }))
        .optional(),
    error: z.string().optional(),
});
