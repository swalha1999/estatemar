import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import {
	db,
	organization as organizationTable,
	organizationMember,
} from "../db";
import * as schema from "../db/schema/auth";

export async function createPersonalOrganization(
	userId: string,
	userName: string | null,
	userEmail: string,
) {
	const personalOrgName = userName || userEmail.split("@")[0] || "Personal";
	const slug = `personal-${userId.slice(0, 8)}`;

	try {
		// Create personal organization
		const [org] = await db
			.insert(organization)
			.values({
				name: personalOrgName,
				slug: slug,
				type: "personal",
				createdBy: userId,
			})
			.returning();

		if (org) {
			// Add user as owner of their personal organization
			await db.insert(organizationMember).values({
				organizationId: org.id,
				userId: userId,
				role: "owner",
			});
		}
	} catch (error) {
		console.error("Failed to create personal organization:", error);
		// Don't throw error to prevent signup failure
	}
}

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: () => crypto.randomUUID(),
		},
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
	},
});
