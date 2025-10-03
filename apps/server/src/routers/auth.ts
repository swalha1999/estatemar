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

	getUserInvitations: protectedProcedure.handler(async ({ context }) => {
		const invitations = await auth.api.listUserInvitations({
			headers: context.honoContext.req.raw.headers,
			query: {
				email: context.session.user.email,
			},
		});

		// // add the organization to the invitations with full data
		// const invitationsWithOrganization = await Promise.all(invitations.map(async (invitation) => ({
		// 	...invitation,
		// 	organization: await auth.api.getFullOrganization({
		// 		headers: context.honoContext.req.raw.headers,
		// 		query: {
		// 			organizationId: invitation.organizationId,
		// 		},
		// 	}),
		// 	inviter: await auth.api.accountInfo({
		// 		headers: context.honoContext.req.raw.headers,
		// 		body: {
		// 			accountId: invitation.inviterId,
		// 		},
		// 	}),
		// })));

		return invitations;
	}),

	acceptInvitation: protectedProcedure
		.input(
			z.object({
				invitationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.acceptInvitation({
				headers: context.honoContext.req.raw.headers,
				body: {
					invitationId: input.invitationId,
				},
			});
		}),

	rejectInvitation: protectedProcedure
		.input(
			z.object({
				invitationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.rejectInvitation({
				headers: context.honoContext.req.raw.headers,
				body: {
					invitationId: input.invitationId,
				},
			});
		}),

	cancelInvitation: protectedProcedure
		.input(
			z.object({
				invitationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.cancelInvitation({
				headers: context.honoContext.req.raw.headers,
				body: {
					invitationId: input.invitationId,
				},
			});
		}),

	leaveOrganization: protectedProcedure
		.input(
			z.object({
				organizationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.leaveOrganization({
				headers: context.honoContext.req.raw.headers,
				body: {
					organizationId: input.organizationId,
				},
			});
		}),

	removeMember: protectedProcedure
		.input(
			z.object({
				memberIdOrEmail: z.string(),
				organizationId: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.removeMember({
				headers: context.honoContext.req.raw.headers,
				body: {
					memberIdOrEmail: input.memberIdOrEmail,
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

	addPhoneNumber: protectedProcedure
		.input(
			z.object({
				phoneNumber: z.string(),
			}),
		)
		.handler(async ({ input, context }) => {
			return await auth.api.updateUser({
				headers: context.honoContext.req.raw.headers,
				body: {
					phoneNumber: input.phoneNumber,
				},
			});
		}),

	getUserData: protectedProcedure.handler(async ({ context }) => {
		return {
			user: context.session.user,
			session: context.session.session,
		};
	}),
};

export const authRouter = {
	organization: organizationRouter,
};
