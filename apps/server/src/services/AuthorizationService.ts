import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { organizationMember } from "../db/schema/organizations";
import { ForbiddenError, UnauthorizedError } from "../errors/base";
import type { AuthContext, OrganizationContext } from "../types/common";

export type UserRole = "owner" | "admin" | "member" | "viewer";

export class AuthorizationService {
	async validateAuthContext(session: any): Promise<AuthContext> {
		const userId = session?.user?.id;
		const userEmail = session?.user?.email;

		if (!userId || !userEmail) {
			throw new UnauthorizedError("Authentication required");
		}

		return { userId, userEmail };
	}

	async validateOrganizationAccess(
		authContext: AuthContext,
		organizationId: string,
		requiredRoles: UserRole[] = ["owner", "admin", "member", "viewer"],
	): Promise<OrganizationContext> {
		const membership = await db
			.select()
			.from(organizationMember)
			.where(
				and(
					eq(organizationMember.userId, authContext.userId),
					eq(organizationMember.organizationId, organizationId),
				),
			)
			.limit(1);

		if (membership.length === 0) {
			throw new ForbiddenError("Access denied to organization");
		}

		const userRole = membership[0].role as UserRole;
		if (!requiredRoles.includes(userRole)) {
			throw new ForbiddenError(
				`Insufficient permissions. Required: ${requiredRoles.join(", ")}`,
			);
		}

		return {
			...authContext,
			organizationId,
			userRole,
		};
	}

	async canEditOrganizationProperties(
		authContext: AuthContext,
		organizationId: string,
	): Promise<OrganizationContext> {
		return this.validateOrganizationAccess(authContext, organizationId, [
			"owner",
			"admin",
			"member",
		]);
	}

	async canViewOrganizationProperties(
		authContext: AuthContext,
		organizationId: string,
	): Promise<OrganizationContext> {
		return this.validateOrganizationAccess(authContext, organizationId, [
			"owner",
			"admin",
			"member",
			"viewer",
		]);
	}

	async canEditProperty(
		authContext: AuthContext,
		propertyOwnership: { userId: string; organizationId: string | null },
	): Promise<boolean> {
		// User owns the property directly
		if (propertyOwnership.userId === authContext.userId) {
			return true;
		}

		// Property belongs to organization - check if user can edit
		if (propertyOwnership.organizationId) {
			try {
				await this.canEditOrganizationProperties(
					authContext,
					propertyOwnership.organizationId,
				);
				return true;
			} catch {
				return false;
			}
		}

		return false;
	}

	async canViewProperty(
		authContext: AuthContext,
		propertyOwnership: { userId: string; organizationId: string | null },
	): Promise<boolean> {
		// User owns the property directly
		if (propertyOwnership.userId === authContext.userId) {
			return true;
		}

		// Property belongs to organization - check if user can view
		if (propertyOwnership.organizationId) {
			try {
				await this.canViewOrganizationProperties(
					authContext,
					propertyOwnership.organizationId,
				);
				return true;
			} catch {
				return false;
			}
		}

		return false;
	}
}