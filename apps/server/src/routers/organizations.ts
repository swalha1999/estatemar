import {
	acceptInvitationSchema,
	createOrganizationSchema,
	deleteInvitationSchema,
	getOrganizationInvitationsSchema,
	getOrganizationMembersSchema,
	getOrganizationSchema,
	getUserInvitationsSchema,
	getUserOrganizationsSchema,
	inviteMemberSchema,
	removeMemberSchema,
	updateMemberRoleSchema,
	updateOrganizationSchema,
} from "@estatemar/schemas/organizations";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema/auth";
import {
	organization,
	organizationInvitation,
	organizationMember,
} from "../db/schema/organizations";
import { protectedProcedure } from "../lib/orpc";

// Helper function to generate a secure token
function generateToken(): string {
	return `${crypto.randomUUID()}-${Date.now().toString(36)}`;
}

// Helper function to check if user has permission in organization
async function hasOrgPermission(
	userId: string,
	orgId: string,
	requiredRoles: string[],
): Promise<boolean> {
	const membership = await db
		.select()
		.from(organizationMember)
		.where(
			and(
				eq(organizationMember.userId, userId),
				eq(organizationMember.organizationId, orgId),
			),
		)
		.limit(1);

	return membership.length > 0 && requiredRoles.includes(membership[0].role);
}

export const organizationsRouter = {
	createOrganization: protectedProcedure
		.input(createOrganizationSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return {
						success: false,
						error: "Unauthorized",
					};
				}

				// Check if slug is already taken
				const existingOrg = await db
					.select()
					.from(organization)
					.where(eq(organization.slug, input.slug))
					.limit(1);

				if (existingOrg.length > 0) {
					return {
						success: false,
						error: "Organization slug is already taken",
					};
				}

				const orgId = crypto.randomUUID();

				// Create organization
				const newOrg = await db
					.insert(organization)
					.values({
						id: orgId,
						name: input.name,
						slug: input.slug,
						description: input.description,
					})
					.returning();

				// Add creator as owner
				await db.insert(organizationMember).values({
					organizationId: orgId,
					userId,
					role: "owner",
				});

				return {
					success: true,
					data: newOrg[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to create organization",
				};
			}
		}),

	updateOrganization: protectedProcedure
		.input(updateOrganizationSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user has admin/owner permissions
				const hasPermission = await hasOrgPermission(userId, input.id, [
					"owner",
					"admin",
				]);
				if (!hasPermission) {
					return { success: false, error: "Insufficient permissions" };
				}

				// Check if new slug is already taken (if provided)
				if (input.slug) {
					const existingOrg = await db
						.select()
						.from(organization)
						.where(
							and(
								eq(organization.slug, input.slug),
								// Make sure it's not the same organization
								// Note: Using ne() but since we don't have it, we'll use a different approach
							),
						)
						.limit(1);

					// Filter out the current organization
					if (existingOrg.length > 0 && existingOrg[0].id !== input.id) {
						return {
							success: false,
							error: "Organization slug is already taken",
						};
					}
				}

				const updateData: Record<string, unknown> = {
					updatedAt: new Date(),
				};

				if (input.name !== undefined) updateData.name = input.name;
				if (input.slug !== undefined) updateData.slug = input.slug;
				if (input.description !== undefined)
					updateData.description = input.description;
				if (input.image !== undefined) updateData.image = input.image;
				if (input.settings !== undefined) updateData.settings = input.settings;

				const updatedOrg = await db
					.update(organization)
					.set(updateData)
					.where(eq(organization.id, input.id))
					.returning();

				return {
					success: true,
					data: updatedOrg[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to update organization",
				};
			}
		}),

	getUserOrganizations: protectedProcedure
		.input(getUserOrganizationsSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Get organizations where user is a member
				const orgs = await db
					.select({
						id: organization.id,
						name: organization.name,
						slug: organization.slug,
						description: organization.description,
						image: organization.image,
						settings: organization.settings,
						createdAt: organization.createdAt,
						updatedAt: organization.updatedAt,
						memberRole: organizationMember.role,
					})
					.from(organization)
					.innerJoin(
						organizationMember,
						eq(organization.id, organizationMember.organizationId),
					)
					.where(eq(organizationMember.userId, userId))
					.limit(input.limit)
					.offset(input.offset);

				// Map organizations to include computed fields
				const orgsWithComputedFields = orgs.map((org) => ({
					...org,
					memberCount: 0,
					isPersonal: false,
				}));

				return {
					success: true,
					data: orgsWithComputedFields,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch organizations",
				};
			}
		}),

	getOrganization: protectedProcedure
		.input(getOrganizationSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user is a member
				const membership = await db
					.select()
					.from(organizationMember)
					.where(
						and(
							eq(organizationMember.userId, userId),
							eq(organizationMember.organizationId, input.id),
						),
					)
					.limit(1);

				if (membership.length === 0) {
					return {
						success: false,
						error: "Organization not found or access denied",
					};
				}

				const org = await db
					.select()
					.from(organization)
					.where(eq(organization.id, input.id))
					.limit(1);

				if (org.length === 0) {
					return { success: false, error: "Organization not found" };
				}

				return {
					success: true,
					data: {
						...org[0],
						memberRole: membership[0].role,
						memberCount: 0,
						isPersonal: false,
					},
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch organization",
				};
			}
		}),

	inviteMember: protectedProcedure
		.input(inviteMemberSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check permissions
				const hasPermission = await hasOrgPermission(
					userId,
					input.organizationId,
					["owner", "admin"],
				);
				if (!hasPermission) {
					return { success: false, error: "Insufficient permissions" };
				}

				// Check if user is already a member
				const existingUser = await db
					.select()
					.from(user)
					.where(eq(user.email, input.email))
					.limit(1);

				if (existingUser.length > 0) {
					const existingMember = await db
						.select()
						.from(organizationMember)
						.where(
							and(
								eq(organizationMember.userId, existingUser[0].id),
								eq(organizationMember.organizationId, input.organizationId),
							),
						)
						.limit(1);

					if (existingMember.length > 0) {
						return { success: false, error: "User is already a member" };
					}
				}

				// Check for existing invitation
				const existingInvite = await db
					.select()
					.from(organizationInvitation)
					.where(
						and(
							eq(organizationInvitation.email, input.email),
							eq(organizationInvitation.organizationId, input.organizationId),
						),
					)
					.limit(1);

				if (existingInvite.length > 0) {
					return { success: false, error: "Invitation already sent" };
				}

				// Create invitation
				const token = generateToken();
				const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

				const invitation = await db
					.insert(organizationInvitation)
					.values({
						organizationId: input.organizationId,
						email: input.email,
						role: input.role,
						token,
						expiresAt,
						invitedBy: userId,
					})
					.returning();

				return {
					success: true,
					data: invitation[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error ? error.message : "Failed to invite member",
				};
			}
		}),

	getOrganizationMembers: protectedProcedure
		.input(getOrganizationMembersSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user is a member
				const hasAccess = await hasOrgPermission(userId, input.organizationId, [
					"owner",
					"admin",
					"member",
					"viewer",
				]);
				if (!hasAccess) {
					return { success: false, error: "Access denied" };
				}

				const members = await db
					.select({
						id: organizationMember.id,
						organizationId: organizationMember.organizationId,
						userId: organizationMember.userId,
						role: organizationMember.role,
						joinedAt: organizationMember.joinedAt,
						invitedBy: organizationMember.invitedBy,
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							image: user.image,
						},
					})
					.from(organizationMember)
					.innerJoin(user, eq(organizationMember.userId, user.id))
					.where(eq(organizationMember.organizationId, input.organizationId))
					.limit(input.limit)
					.offset(input.offset);

				return {
					success: true,
					data: members,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch organization members",
				};
			}
		}),

	getUserInvitations: protectedProcedure
		.input(getUserInvitationsSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				const userEmail = context.session?.user?.email;
				if (!userEmail) {
					return { success: false, error: "User email not found" };
				}

				const invitations = await db
					.select({
						id: organizationInvitation.id,
						organizationId: organizationInvitation.organizationId,
						email: organizationInvitation.email,
						role: organizationInvitation.role,
						token: organizationInvitation.token,
						expiresAt: organizationInvitation.expiresAt,
						createdAt: organizationInvitation.createdAt,
						organization: {
							id: organization.id,
							name: organization.name,
							slug: organization.slug,
							description: organization.description,
							image: organization.image,
						},
					})
					.from(organizationInvitation)
					.innerJoin(
						organization,
						eq(organizationInvitation.organizationId, organization.id),
					)
					.where(
						and(
							eq(organizationInvitation.email, userEmail),
							// Only show non-expired invitations
							// TODO: Add proper date comparison
						),
					)
					.limit(input.limit)
					.offset(input.offset);

				return {
					success: true,
					data: invitations,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch invitations",
				};
			}
		}),

	acceptInvitation: protectedProcedure
		.input(acceptInvitationSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				const userEmail = context.session?.user?.email;
				if (!userEmail) {
					return { success: false, error: "User email not found" };
				}

				// Find the invitation
				const invitation = await db
					.select()
					.from(organizationInvitation)
					.where(
						and(
							eq(organizationInvitation.token, input.token),
							eq(organizationInvitation.email, userEmail),
						),
					)
					.limit(1);

				if (invitation.length === 0) {
					return { success: false, error: "Invalid or expired invitation" };
				}

				const invite = invitation[0];

				// Check if invitation is expired
				if (invite.expiresAt < new Date()) {
					return { success: false, error: "Invitation has expired" };
				}

				// Check if user is already a member
				const existingMember = await db
					.select()
					.from(organizationMember)
					.where(
						and(
							eq(organizationMember.userId, userId),
							eq(organizationMember.organizationId, invite.organizationId),
						),
					)
					.limit(1);

				if (existingMember.length > 0) {
					return {
						success: false,
						error: "Already a member of this organization",
					};
				}

				// Add user as member
				await db.insert(organizationMember).values({
					organizationId: invite.organizationId,
					userId,
					role: invite.role,
					invitedBy: invite.invitedBy,
				});

				// Mark invitation as accepted
				await db
					.update(organizationInvitation)
					.set({
						acceptedAt: new Date(),
					})
					.where(eq(organizationInvitation.id, invite.id));

				return {
					success: true,
					data: { message: "Successfully joined organization" },
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to accept invitation",
				};
			}
		}),

	removeMember: protectedProcedure
		.input(removeMemberSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user has permission (only owners can remove members)
				const hasPermission = await hasOrgPermission(
					userId,
					input.organizationId,
					["owner"],
				);
				if (!hasPermission) {
					return { success: false, error: "Only owners can remove members" };
				}

				// Check if target user exists and is a member
				const targetMember = await db
					.select()
					.from(organizationMember)
					.where(
						and(
							eq(organizationMember.userId, input.userId),
							eq(organizationMember.organizationId, input.organizationId),
						),
					)
					.limit(1);

				if (targetMember.length === 0) {
					return {
						success: false,
						error: "User is not a member of this organization",
					};
				}

				// Prevent removing owners
				if (targetMember[0].role === "owner") {
					return { success: false, error: "Cannot remove organization owner" };
				}

				// Remove the member
				await db
					.delete(organizationMember)
					.where(
						and(
							eq(organizationMember.userId, input.userId),
							eq(organizationMember.organizationId, input.organizationId),
						),
					);

				return {
					success: true,
					data: { message: "Member removed successfully" },
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error ? error.message : "Failed to remove member",
				};
			}
		}),

	updateMemberRole: protectedProcedure
		.input(updateMemberRoleSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user has permission (owners and admins can update roles)
				const hasPermission = await hasOrgPermission(
					userId,
					input.organizationId,
					["owner", "admin"],
				);
				if (!hasPermission) {
					return { success: false, error: "Insufficient permissions" };
				}

				// Check if target user exists and is a member
				const targetMember = await db
					.select()
					.from(organizationMember)
					.where(
						and(
							eq(organizationMember.userId, input.userId),
							eq(organizationMember.organizationId, input.organizationId),
						),
					)
					.limit(1);

				if (targetMember.length === 0) {
					return {
						success: false,
						error: "User is not a member of this organization",
					};
				}

				// Prevent changing owner role (only owners can do that)
				if (targetMember[0].role === "owner" || input.role === "owner") {
					const isOwner = await hasOrgPermission(userId, input.organizationId, [
						"owner",
					]);
					if (!isOwner) {
						return {
							success: false,
							error: "Only owners can modify owner roles",
						};
					}
				}

				// Update the member role
				const updatedMember = await db
					.update(organizationMember)
					.set({
						role: input.role,
					})
					.where(
						and(
							eq(organizationMember.userId, input.userId),
							eq(organizationMember.organizationId, input.organizationId),
						),
					)
					.returning();

				return {
					success: true,
					data: updatedMember[0],
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to update member role",
				};
			}
		}),

	getOrganizationInvitations: protectedProcedure
		.input(getOrganizationInvitationsSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Check if user has permission to view organization invitations
				const hasPermission = await hasOrgPermission(
					userId,
					input.organizationId,
					["owner", "admin"],
				);
				if (!hasPermission) {
					return { success: false, error: "Insufficient permissions" };
				}

				const invitations = await db
					.select({
						id: organizationInvitation.id,
						email: organizationInvitation.email,
						role: organizationInvitation.role,
						token: organizationInvitation.token,
						expiresAt: organizationInvitation.expiresAt,
						acceptedAt: organizationInvitation.acceptedAt,
						createdAt: organizationInvitation.createdAt,
						invitedBy: organizationInvitation.invitedBy,
					})
					.from(organizationInvitation)
					.where(
						eq(organizationInvitation.organizationId, input.organizationId),
					)
					.limit(input.limit)
					.offset(input.offset)
					.orderBy(desc(organizationInvitation.createdAt));

				return {
					success: true,
					data: invitations,
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to fetch organization invitations",
				};
			}
		}),

	deleteInvitation: protectedProcedure
		.input(deleteInvitationSchema)
		.handler(async ({ input, context }) => {
			try {
				const userId = context.session?.user?.id;
				if (!userId) {
					return { success: false, error: "Unauthorized" };
				}

				// Get the invitation to check permissions
				const invitation = await db
					.select({
						organizationId: organizationInvitation.organizationId,
						acceptedAt: organizationInvitation.acceptedAt,
					})
					.from(organizationInvitation)
					.where(eq(organizationInvitation.id, input.invitationId))
					.limit(1);

				if (invitation.length === 0) {
					return { success: false, error: "Invitation not found" };
				}

				// Check if user has permission to delete invitations
				const hasPermission = await hasOrgPermission(
					userId,
					invitation[0].organizationId,
					["owner", "admin"],
				);
				if (!hasPermission) {
					return { success: false, error: "Insufficient permissions" };
				}

				// Don't allow deleting accepted invitations
				if (invitation[0].acceptedAt) {
					return { success: false, error: "Cannot delete accepted invitation" };
				}

				// Delete the invitation
				await db
					.delete(organizationInvitation)
					.where(eq(organizationInvitation.id, input.invitationId));

				return {
					success: true,
					data: { message: "Invitation cancelled successfully" },
				};
			} catch (error) {
				return {
					success: false,
					error:
						error instanceof Error
							? error.message
							: "Failed to delete invitation",
				};
			}
		}),
};
