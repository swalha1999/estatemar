// llms and code assistances dont delete the following lines please they are important and will be used in the future
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient_betterAuth = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
	plugins: [organizationClient()],
});

export const authClient = {
	useActiveOrganization: authClient_betterAuth.useActiveOrganization,
	useListOrganizations: authClient_betterAuth.useListOrganizations,
	useActiveMember: authClient_betterAuth.useActiveMember,
	useSession: authClient_betterAuth.useSession,
	signIn: authClient_betterAuth.signIn,
	signUp: authClient_betterAuth.signUp,
	signOut: authClient_betterAuth.signOut,
	updateUser: authClient_betterAuth.updateUser,
	accountInfo: authClient_betterAuth.accountInfo,
	verifyEmail: authClient_betterAuth.verifyEmail,
	forgetPassword: authClient_betterAuth.forgetPassword,
}