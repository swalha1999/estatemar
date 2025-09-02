import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	plugins: [
		openAPI(),
		organization({
			allowUserToCreateOrganization: true,
			organizationLimit: 10,
			membershipLimit: 100,
			creatorRole: "owner",
		}),
	],
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
