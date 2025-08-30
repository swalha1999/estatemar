import { z } from "zod";
export declare const organizationRoleEnum: z.ZodEnum<{
    owner: "owner";
    admin: "admin";
    member: "member";
    viewer: "viewer";
}>;
export type OrganizationRole = z.infer<typeof organizationRoleEnum>;
export declare const organizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    settings: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export type Organization = z.infer<typeof organizationSchema>;
export declare const organizationMemberSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<{
        owner: "owner";
        admin: "admin";
        member: "member";
        viewer: "viewer";
    }>;
    joinedAt: z.ZodDate;
    invitedBy: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        image: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type OrganizationMember = z.infer<typeof organizationMemberSchema>;
export declare const organizationInvitationSchema: z.ZodObject<{
    id: z.ZodString;
    organizationId: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        owner: "owner";
        admin: "admin";
        member: "member";
        viewer: "viewer";
    }>;
    token: z.ZodString;
    expiresAt: z.ZodDate;
    invitedBy: z.ZodString;
    acceptedAt: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
}, z.core.$strip>;
export type OrganizationInvitation = z.infer<typeof organizationInvitationSchema>;
export declare const createOrganizationSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export declare const updateOrganizationSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    settings: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, z.core.$strip>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export declare const getOrganizationSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;
export declare const inviteMemberSchema: z.ZodObject<{
    organizationId: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<{
        admin: "admin";
        member: "member";
        viewer: "viewer";
    }>;
}, z.core.$strip>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export declare const updateMemberRoleSchema: z.ZodObject<{
    organizationId: z.ZodString;
    userId: z.ZodString;
    role: z.ZodEnum<{
        owner: "owner";
        admin: "admin";
        member: "member";
        viewer: "viewer";
    }>;
}, z.core.$strip>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export declare const removeMemberSchema: z.ZodObject<{
    organizationId: z.ZodString;
    userId: z.ZodString;
}, z.core.$strip>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;
export declare const getOrganizationMembersSchema: z.ZodObject<{
    organizationId: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetOrganizationMembersInput = z.infer<typeof getOrganizationMembersSchema>;
export declare const acceptInvitationSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
export declare const declineInvitationSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export type DeclineInvitationInput = z.infer<typeof declineInvitationSchema>;
export declare const getUserOrganizationsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetUserOrganizationsInput = z.infer<typeof getUserOrganizationsSchema>;
export declare const getUserInvitationsSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetUserInvitationsInput = z.infer<typeof getUserInvitationsSchema>;
export declare const getOrganizationInvitationsSchema: z.ZodObject<{
    organizationId: z.ZodString;
    limit: z.ZodDefault<z.ZodNumber>;
    offset: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type GetOrganizationInvitationsInput = z.infer<typeof getOrganizationInvitationsSchema>;
export declare const deleteInvitationSchema: z.ZodObject<{
    invitationId: z.ZodString;
}, z.core.$strip>;
export type DeleteInvitationInput = z.infer<typeof deleteInvitationSchema>;
export declare const switchOrganizationSchema: z.ZodObject<{
    organizationId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SwitchOrganizationInput = z.infer<typeof switchOrganizationSchema>;
export declare const organizationWithMemberSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    image: z.ZodOptional<z.ZodString>;
    settings: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodAny>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
    memberRole: z.ZodEnum<{
        owner: "owner";
        admin: "admin";
        member: "member";
        viewer: "viewer";
    }>;
    memberCount: z.ZodNumber;
    isPersonal: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type OrganizationWithMember = z.infer<typeof organizationWithMemberSchema>;
