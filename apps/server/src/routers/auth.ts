import { z } from "zod";
import { auth } from "@/lib/auth";
import { protectedProcedure } from "../lib/orpc";

const organizationRouter = {
	setActive: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
				organizationSlug: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.setActiveOrganization({
				headers: context.honoContext.req.raw.headers,
				body: {
					organizationId: input.organizationId,
					organizationSlug: input.organizationSlug,
				},
			});
		}),

	getActiveOrganizationMembers: protectedProcedure.handler(
		async ({ context }) => {
			return await auth.api.listMembers({
				headers: context.honoContext.req.raw.headers,
			});
		},
	),

	inviteMember: protectedProcedure
		.input(
			z.object({
				email: z.string(),
				role: z.enum(["member", "owner", "admin"]),
				organizationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.createInvitation({
				headers: context.honoContext.req.raw.headers,
				body: {
					email: input.email,
					role: input.role,
					organizationId: input.organizationId,
				},
			});
		}),

	createOrganization: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				slug: z.string(),
				logo: z.string(),
				metadata: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.createOrganization({
				headers: context.honoContext.req.raw.headers,
				body: {
					name: input.name,
					slug: input.slug,
					logo: input.logo,
					userId: context.session.user.id,
					keepCurrentActiveOrganization: false,
				},
			});
		}),
};

export const authRouter = {
	organization: organizationRouter,
};
