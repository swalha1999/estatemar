import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, organization, organizationMember, user } from "@/db";
import { getOrganizationContext } from "@/lib/context";
import { protectedProcedure } from "@/lib/orpc";
import { capitalize, generateSlug } from "@/utils/strings";

export const organizationRouter = {
	getUserOrganizations: protectedProcedure.handler(async ({ context }) => {
		const userId = context.session.user.id;

		const userOrgs = await db
			.select({
				id: organization.id,
				name: organization.name,
				slug: organization.slug,
				type: organization.type,
				role: organizationMember.role,
			})
			.from(organizationMember)
			.innerJoin(
				organization,
				eq(organization.id, organizationMember.organizationId),
			)
			.where(eq(organizationMember.userId, userId));

		return userOrgs;
	}),

	createOrganization: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1).max(100),
			}),
		)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const newOrg = await db.transaction(async (tx) => {
				const [org] = await tx
					.insert(organization)
					.values({
						name: capitalize(input.name),
						slug: generateSlug(input.name),
						type: "team",
						createdBy: userId,
					})
					.returning();

				if (!org) {
					throw new ORPCError("INTERNAL_SERVER_ERROR", {
						message: "Failed to create organization",
					});
				}

				await tx.insert(organizationMember).values({
					organizationId: org.id,
					userId: userId,
					role: "owner",
				});

				return org;
			});

			return newOrg;
		}),

	getOrganizationMembers: protectedProcedure.handler(async ({ context }) => {
		const userId = context.session.user.id;
		const orgContext = await getOrganizationContext(
			context.honoContext,
			userId,
		);

		if (!orgContext) {
			throw new ORPCError("BAD_REQUEST");
		}

		const members = await db
			.select({
				id: organizationMember.id,
				role: organizationMember.role,
				joinedAt: organizationMember.joinedAt,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
			})
			.from(organizationMember)
			.innerJoin(user, eq(user.id, organizationMember.userId))
			.where(eq(organizationMember.organizationId, orgContext.organization.id));

		return members;
	}),

	inviteMember: protectedProcedure
		.input(
			z.object({
				email: z.string().email(),
				role: z.enum(["admin", "member"]),
			}),
		)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const orgContext = await getOrganizationContext(
				context.honoContext,
				userId,
			);

			if (!orgContext || !["owner", "admin"].includes(orgContext.role)) {
				throw new ORPCError("FORBIDDEN");
			}

			const existingUser = await db
				.select()
				.from(user)
				.where(eq(user.email, input.email))
				.limit(1);

			if (!existingUser.length) {
				throw new ORPCError("NOT_FOUND");
			}

			const targetUser = existingUser[0]!;

			const existingMember = await db
				.select()
				.from(organizationMember)
				.where(
					and(
						eq(organizationMember.organizationId, orgContext.organization.id),
						eq(organizationMember.userId, targetUser.id),
					),
				)
				.limit(1);

			if (existingMember.length) {
				throw new ORPCError("CONFLICT");
			}

			await db.insert(organizationMember).values({
				organizationId: orgContext.organization.id,
				userId: targetUser.id,
				role: input.role,
			});

			return { success: true };
		}),

	removeMember: protectedProcedure
		.input(z.object({ memberId: z.string() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const orgContext = await getOrganizationContext(
				context.honoContext,
				userId,
			);

			if (!orgContext || !["owner", "admin"].includes(orgContext.role)) {
				throw new ORPCError("FORBIDDEN");
			}

			const member = await db
				.select()
				.from(organizationMember)
				.where(
					and(
						eq(organizationMember.id, input.memberId),
						eq(organizationMember.organizationId, orgContext.organization.id),
					),
				)
				.limit(1);

			if (!member.length) {
				throw new ORPCError("NOT_FOUND");
			}

			const memberData = member[0]!;

			if (memberData.role === "owner" && orgContext.role !== "owner") {
				throw new ORPCError("FORBIDDEN");
			}

			if (memberData.userId === userId) {
				throw new ORPCError("BAD_REQUEST");
			}

			await db
				.delete(organizationMember)
				.where(eq(organizationMember.id, input.memberId));

			return { success: true };
		}),

	updateMemberRole: protectedProcedure
		.input(
			z.object({
				memberId: z.string(),
				role: z.enum(["admin", "member"]),
			}),
		)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;
			const orgContext = await getOrganizationContext(
				context.honoContext,
				userId,
			);

			if (!orgContext || orgContext.role !== "owner") {
				throw new ORPCError("FORBIDDEN");
			}

			const member = await db
				.select()
				.from(organizationMember)
				.where(
					and(
						eq(organizationMember.id, input.memberId),
						eq(organizationMember.organizationId, orgContext.organization.id),
					),
				)
				.limit(1);

			if (!member.length) {
				throw new ORPCError("NOT_FOUND");
			}

			const memberData = member[0]!;

			if (memberData.role === "owner") {
				throw new ORPCError("BAD_REQUEST");
			}

			await db
				.update(organizationMember)
				.set({ role: input.role })
				.where(eq(organizationMember.id, input.memberId));

			return { success: true };
		}),

	getCurrentOrganization: protectedProcedure.handler(async ({ context }) => {
		const userId = context.session.user.id;
		const orgContext = await getOrganizationContext(
			context.honoContext,
			userId,
		);

		if (!orgContext) {
			throw new ORPCError("BAD_REQUEST");
		}

		return orgContext;
	}),
};
