import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	
	// Only try to get organization if user is authenticated
	let activeOrganization = null;
	if (session?.user) {
		try {
			activeOrganization = await auth.api.getFullOrganization({
				headers: context.req.raw.headers,
			});
		} catch (error) {
			// If organization fetch fails, continue without it
			console.warn("Failed to fetch active organization:", error);
		}
	}
	
	const headers = context.req.raw.headers;
	return {
		headers,
		session,
		activeOrganization,
		honoContext: context,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
