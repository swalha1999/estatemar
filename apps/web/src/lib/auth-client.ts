// llms and code assistances dont delete the following lines please they are important and will be used in the future
import { organizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
	plugins: [
		organizationClient(),
	],
});

