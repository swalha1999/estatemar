import { z } from "zod";

// Organization role enum
export const organizationRoleEnum = z.enum([
	"owner",
	"admin",
	"member",
	"viewer",
]);
export type OrganizationRole = z.infer<typeof organizationRoleEnum>;

// Base organization schema
export const organizationSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, "Organization name is required").max(100),
	slug: z
		.string()
		.min(1)
		.max(50)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	description: z.string().optional(),
	image: z.string().url().optional(),
	settings: z.record(z.string(), z.any()).default({}),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type Organization = z.infer<typeof organizationSchema>;

// Organization member schema
export const organizationMemberSchema = z.object({
	id: z.string().uuid(),
	organizationId: z.string().uuid(),
	userId: z.string().uuid(),
	role: organizationRoleEnum,
	joinedAt: z.date(),
	invitedBy: z.string().uuid().optional(),
	user: z
		.object({
			id: z.string().uuid(),
			name: z.string(),
			email: z.string().email(),
			image: z.string().optional(),
		})
		.optional(),
});

export type OrganizationMember = z.infer<typeof organizationMemberSchema>;

// Organization invitation schema
export const organizationInvitationSchema = z.object({
	id: z.string().uuid(),
	organizationId: z.string().uuid(),
	email: z.string().email(),
	role: organizationRoleEnum,
	token: z.string(),
	expiresAt: z.date(),
	invitedBy: z.string().uuid(),
	acceptedAt: z.date().optional(),
	createdAt: z.date(),
});

export type OrganizationInvitation = z.infer<
	typeof organizationInvitationSchema
>;

// Create organization schema
export const createOrganizationSchema = z.object({
	name: z.string().min(1, "Organization name is required").max(100),
	slug: z
		.string()
		.min(1)
		.max(50)
		.regex(
			/^[a-z0-9-]+$/,
			"Slug must contain only lowercase letters, numbers, and hyphens",
		),
	description: z.string().max(500).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

// Update organization schema
export const updateOrganizationSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100).optional(),
	slug: z
		.string()
		.min(1)
		.max(50)
		.regex(/^[a-z0-9-]+$/)
		.optional(),
	description: z.string().max(500).optional(),
	image: z.string().url().optional(),
	settings: z.record(z.string(), z.any()).optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// Get organization schema
export const getOrganizationSchema = z.object({
	id: z.string().uuid(),
});

export type GetOrganizationInput = z.infer<typeof getOrganizationSchema>;

// Invite member schema
export const inviteMemberSchema = z.object({
	organizationId: z.string().uuid(),
	email: z.string().email(),
	role: organizationRoleEnum.exclude(["owner"]),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

// Update member role schema
export const updateMemberRoleSchema = z.object({
	organizationId: z.string().uuid(),
	userId: z.string().uuid(),
	role: organizationRoleEnum,
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

// Remove member schema
export const removeMemberSchema = z.object({
	organizationId: z.string().uuid(),
	userId: z.string().uuid(),
});

export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;

// Get organization members schema
export const getOrganizationMembersSchema = z.object({
	organizationId: z.string().uuid(),
	limit: z.number().min(1).max(100).default(50),
	offset: z.number().min(0).default(0),
});

export type GetOrganizationMembersInput = z.infer<
	typeof getOrganizationMembersSchema
>;

// Accept invitation schema
export const acceptInvitationSchema = z.object({
	token: z.string(),
});

export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;

// Decline invitation schema
export const declineInvitationSchema = z.object({
	token: z.string(),
});

export type DeclineInvitationInput = z.infer<typeof declineInvitationSchema>;

// Get user organizations schema
export const getUserOrganizationsSchema = z.object({
	limit: z.number().min(1).max(50).default(25),
	offset: z.number().min(0).default(0),
});

export type GetUserOrganizationsInput = z.infer<
	typeof getUserOrganizationsSchema
>;

// Get user invitations schema
export const getUserInvitationsSchema = z.object({
	limit: z.number().min(1).max(50).default(25),
	offset: z.number().min(0).default(0),
});

export type GetUserInvitationsInput = z.infer<typeof getUserInvitationsSchema>;

// Get organization invitations schema (for viewing sent invitations)
export const getOrganizationInvitationsSchema = z.object({
	organizationId: z.string().uuid(),
	limit: z.number().min(1).max(50).default(25),
	offset: z.number().min(0).default(0),
});

export type GetOrganizationInvitationsInput = z.infer<
	typeof getOrganizationInvitationsSchema
>;

// Delete invitation schema
export const deleteInvitationSchema = z.object({
	invitationId: z.string().uuid(),
});

export type DeleteInvitationInput = z.infer<typeof deleteInvitationSchema>;

// Switch organization context schema
export const switchOrganizationSchema = z.object({
	organizationId: z.string().uuid().optional(), // undefined for personal account
});

export type SwitchOrganizationInput = z.infer<typeof switchOrganizationSchema>;

// Organization with member info
export const organizationWithMemberSchema = organizationSchema.extend({
	memberRole: organizationRoleEnum,
	memberCount: z.number(),
	isPersonal: z.boolean().default(false),
});

export type OrganizationWithMember = z.infer<
	typeof organizationWithMemberSchema
>;
