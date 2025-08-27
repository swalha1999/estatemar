import { z } from "zod";
export declare const signInSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const signUpSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const userSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    emailVerified: z.ZodBoolean;
    image: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const sessionSchema: z.ZodObject<{
    id: z.ZodString;
    expiresAt: z.ZodDate;
    token: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    ipAddress: z.ZodOptional<z.ZodString>;
    userAgent: z.ZodOptional<z.ZodString>;
    userId: z.ZodString;
}, z.core.$strip>;
export declare const accountSchema: z.ZodObject<{
    id: z.ZodString;
    accountId: z.ZodString;
    providerId: z.ZodString;
    userId: z.ZodString;
    accessToken: z.ZodOptional<z.ZodString>;
    refreshToken: z.ZodOptional<z.ZodString>;
    idToken: z.ZodOptional<z.ZodString>;
    accessTokenExpiresAt: z.ZodOptional<z.ZodDate>;
    refreshTokenExpiresAt: z.ZodOptional<z.ZodDate>;
    scope: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const verificationSchema: z.ZodObject<{
    id: z.ZodString;
    identifier: z.ZodString;
    value: z.ZodString;
    expiresAt: z.ZodDate;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type Account = z.infer<typeof accountSchema>;
export type Verification = z.infer<typeof verificationSchema>;
