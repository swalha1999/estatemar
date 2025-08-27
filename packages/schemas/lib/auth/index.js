import { z } from "zod";
// Sign-in schema
export const signInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
// Sign-up schema
export const signUpSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
// User schema (for responses)
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    emailVerified: z.boolean(),
    image: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Session schema
export const sessionSchema = z.object({
    id: z.string(),
    expiresAt: z.date(),
    token: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ipAddress: z.string().optional(),
    userAgent: z.string().optional(),
    userId: z.string(),
});
// Account schema
export const accountSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    userId: z.string(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    idToken: z.string().optional(),
    accessTokenExpiresAt: z.date().optional(),
    refreshTokenExpiresAt: z.date().optional(),
    scope: z.string().optional(),
    password: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Verification schema
export const verificationSchema = z.object({
    id: z.string(),
    identifier: z.string(),
    value: z.string(),
    expiresAt: z.date(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
