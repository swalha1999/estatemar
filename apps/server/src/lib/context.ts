import type { Context as HonoContext } from "hono";
import { eq, and } from "drizzle-orm";
import { auth } from "./auth";
import { db, organizationMember, organization } from "@/db";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	return {
		session,
		honoContext: context,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export type OrganizationContext = {
	organization: {
		id: string;
		name: string;
		slug: string;
		type: "personal" | "team";
	};
	role: "owner" | "admin" | "member";
};

export async function getOrganizationContext(
	context: HonoContext,
	userId: string,
): Promise<OrganizationContext | null> {
	const orgId = context.req.header("x-organization-id");

	if (!orgId) {
		return null;
	}

	const membership = await db
		.select({
			role: organizationMember.role,
			organization: {
				id: organization.id,
				name: organization.name,
				slug: organization.slug,
				type: organization.type,
			},
		})
		.from(organizationMember)
		.innerJoin(
			organization,
			eq(organization.id, organizationMember.organizationId),
		)
		.where(
			and(
				eq(organizationMember.organizationId, orgId),
				eq(organizationMember.userId, userId),
			),
		)
		.limit(1);

	return membership[0] || null;
}
