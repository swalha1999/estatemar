import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, organization, phoneNumber } from "better-auth/plugins";
import { db } from "../db";
import * as schema from "../db/schema/auth";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
		// debugLogs: true,
	}),
	plugins: [
		expo(),
		openAPI(),
		organization({
			allowUserToCreateOrganization: true,
			organizationLimit: 9,
			creatorRole: "owner",
		}),
		phoneNumber({
			sendOTP: ({ phoneNumber, code }, request) => {
				console.log(phoneNumber, code, request);
			},
		}),
	],
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	trustedOrigins: [process.env.CORS_ORIGIN || "", "mybettertapp://", "exp://"],
	emailAndPassword: {
		enabled: true,
	},
});
